package com.pets.points.users;

import com.pets.utils.Mail;
import com.septima.application.AsyncEndPoint;
import com.septima.application.endpoint.Answer;
import com.septima.application.exceptions.EndPointException;
import com.septima.application.exceptions.InvalidRequestException;
import com.septima.application.exceptions.NoAccessException;
import com.septima.application.exceptions.NoInstanceException;
import com.septima.changes.InstanceAdd;
import com.septima.queries.SqlQuery;

import javax.servlet.annotation.WebServlet;
import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@WebServlet(asyncSupported = true, urlPatterns = "/users/*")
public class UsersPoint extends AsyncEndPoint {

    private String registrationTemplate;

    public static String md5(String aPassword) {
        try {
            return new String(MessageDigest.getInstance("MD5").digest(aPassword.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(ex);
        }
    }

    static String urlEncode(String aValue) {
        try {
            return URLEncoder.encode(aValue, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException(ex);
        }
    }

    static String loadResource(String resourceName, Charset aCharset, String lf) throws IOException {
        try (BufferedReader buffered = new BufferedReader(new InputStreamReader(UsersPoint.class.getResourceAsStream(resourceName), aCharset))) {
            return buffered.lines().collect(Collectors.joining(lf, "", lf));
        }
    }

    @Override
    public void init() {
        super.init();
        try {
            registrationTemplate = loadResource("/mail/registration.html", StandardCharsets.UTF_8, System.lineSeparator());
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    @Override
    public void get(Answer answer) {
        String userEmail = answer.getRequest().getPathInfo();
        if (userEmail != null && !userEmail.isEmpty()) {
            SqlQuery usersQuery = entities.loadQuery("entities/users/user-by-email");
            usersQuery.requestData(Map.of("email", userEmail))
                    .thenAccept(users -> {
                        if (users.size() == 1) {
                            answer.withJsonObject(users.get(0));
                        } else if (users.isEmpty()) {
                            throw new NoInstanceException("users", "email", userEmail);
                        } else {
                            throw new EndPointException("User '" + userEmail + "' is ambiguous");
                        }
                    })
                    .exceptionally(answer::exceptionally);
        } else {
            throw new InvalidRequestException("User email should be specified in the form of 'users/{user-e-mail-here}'");
        }
    }

    @Override
    public void post(Answer answer) {
        answer.onJsonObject()
                .thenApply(userBody -> {
                    String email = (String) userBody.get("email");
                    String password = (String) userBody.get("password");
                    if (email != null && !email.isEmpty() && password != null && !password.isEmpty()) {
                        return CompletableFuture.allOf(entities.bindChanges(List.of(
                                new InstanceAdd("entities/users/user-and-roles", Map.of(
                                        "userName", email,
                                        "email", email,
                                        "digest", md5(password),
                                        "role", "touch-" + new Random().nextInt(1024 * 1024)
                                ))
                        )).entrySet().stream()
                                .map(e -> e.getKey().commit(e.getValue())).toArray(CompletableFuture[]::new))
                                .thenApply(v -> email);
                    } else {
                        throw new InvalidRequestException("'email' and 'password' are required attributes for user creation");
                    }
                })
                .thenCompose(Function.identity())
                .thenAccept(email -> {
                    answer.getResponse().setHeader("Location", "/users/" + email);
                    answer.ok();
                    String requestUrl = answer.getRequest().getRequestURL().toString();
                    String requestBaseUrl = requestUrl.substring(0, requestUrl.length() - answer.getRequest().getPathInfo().length());
                    startEmailVerification(requestBaseUrl, email);
                })
                .exceptionally(answer::exceptionally);
    }

    @Override
    public void put(Answer answer) {
        String oldUserEmail = answer.getRequest().getPathInfo();
        if (oldUserEmail != null && !oldUserEmail.isEmpty()) {
            Principal principal = answer.getRequest().getUserPrincipal();
            if (principal != null) {
                if (answer.getRequest().isUserInRole("admin") || oldUserEmail.equalsIgnoreCase(principal.getName())) {
                    answer.onJsonObject()
                            .thenApply(jsonBody -> {
                                if (jsonBody.containsKey("password")) {
                                    return changePassword(oldUserEmail, jsonBody);
                                } else {
                                    return updateProfile(oldUserEmail, jsonBody);
                                }
                            })
                            .thenCompose(Function.identity())
                            .thenAccept(affected -> {
                                if (affected > 0) {
                                    answer.ok();
                                } else {
                                    throw new NoInstanceException("users", "email", oldUserEmail);
                                }
                            })
                            .exceptionally(answer::exceptionally);
                } else {
                    throw new NoAccessException("Only user himself can update the profile of '" + oldUserEmail + "'");
                }
            } else {
                recoverPassword(answer, oldUserEmail);
            }
        } else {
            throw new InvalidRequestException("User email should be specified in the form of 'users/{user-e-mail-here}'");
        }
    }

    @Override
    public void delete(Answer answer) {
        String userEmail = answer.getRequest().getPathInfo();
        if (userEmail != null && !userEmail.isEmpty()) {
            Principal principal = answer.getRequest().getUserPrincipal();
            if (principal != null) {
                if (answer.getRequest().isUserInRole("admin") || userEmail.equalsIgnoreCase(principal.getName())) {
                    SqlQuery userDeleteQuery = entities.loadQuery("entities/users/delete-user-by-email");
                    userDeleteQuery.start(Map.of("email", userEmail))
                            .thenAccept(affected -> {
                                if (affected > 0) {
                                    answer.ok();
                                } else {
                                    throw new NoInstanceException("users", "email", userEmail);
                                }
                            })
                            .exceptionally(answer::exceptionally);
                } else {
                    throw new NoAccessException("Only user '" + userEmail + "' can dismiss himself");
                }
            } else {
                throw new NoAccessException("Anonymous users can't dismiss other users");
            }
        } else {
            throw new InvalidRequestException("User email should be specified in the form of 'users/{user-e-mail-here}'");
        }
    }

    private void startEmailVerification(String requestBaseUrl, String email) {
        String nonce = "nonce-" + new Random().nextInt(1048576);
        SqlQuery addNonce = entities.loadQuery("entities/users/add-nonce");
        addNonce.start(Map.of(
                "email", email,
                "nonce", nonce
        ))
                .thenApply(affected -> {
                    String verifyEmailUrl = requestBaseUrl +
                            "/complete-e-mail-verification" +
                            "?a=" + urlEncode(email) +
                            "&b=" + urlEncode(md5(email + nonce));
                    return Mail.getInstance().send(
                            "support@car.online",
                            email,
                            "Car online registration",
                            registrationTemplate.replaceAll("\\$\\{URL\\}", verifyEmailUrl),
                            "text/html"
                    );
                })
                .thenCompose(Function.identity())
                .exceptionally(ex -> {
                    Logger.getLogger(UsersPoint.class.getName()).log(Level.WARNING, null, ex);
                    return null;
                });
    }

    private CompletableFuture<Integer> updateProfile(String oldUserEmail, Map<String, Object> userBody) {
        SqlQuery userUpdateQuery = entities.loadQuery("entities/users/update-user-by-email");
        Map<String, Object> params = new HashMap<>(userBody);
        params.put("oldEmail", oldUserEmail);
        return userUpdateQuery.start(userBody);
    }

    private CompletableFuture<Integer> changePassword(String oldUserEmail, Map<String, Object> newPasswordBody) {
        SqlQuery passwordUpdateQuery = entities.loadQuery("entities/users/change-password-by-email");
        return passwordUpdateQuery.start(Map.of(
                "digest", md5((String) newPasswordBody.get("password")),
                "newDigest", md5((String) newPasswordBody.get("newPassword")),
                "email", oldUserEmail
        ));
    }

    private void recoverPassword(Answer answer, String oldUserEmail) {
        String md5Hash = answer.getRequest().getParameter("b");
        if (md5Hash != null && !md5Hash.isEmpty()) {
            SqlQuery nonceByEmail = entities.loadQuery("entities/users/password-nonce-by-email");
            nonceByEmail
                    .requestData(Map.of(
                            "email", oldUserEmail,
                            "moment", new Date()
                    ))
                    .thenApply(nonces -> {
                        boolean allowed = nonces.stream().anyMatch(nonce -> md5Hash.equals(md5(oldUserEmail + nonce.get("userNonce"))));
                        if (allowed) {
                            return answer.onJsonObject();
                        } else {
                            throw new InvalidRequestException("Password recovering URL is invalid");
                        }
                    })
                    .thenCompose(Function.identity())
                    .thenApply(newPasswordBody -> {
                        if (newPasswordBody.containsKey("newPassword")) {
                            SqlQuery passwordRecoverQuery = entities.loadQuery("entities/users/recover-password-by-email");
                            return passwordRecoverQuery.start(Map.of(
                                    "newDigest", md5((String) newPasswordBody.get("newPassword")),
                                    "email", oldUserEmail
                            ));
                        } else {
                            throw new InvalidRequestException("Recover password request should provide 'newPassword' field");
                        }
                    })
                    .thenCompose(Function.identity())
                    .thenAccept(affected -> {
                        if (affected > 0) {
                            answer.ok();
                        } else {
                            throw new NoInstanceException("users", "email", oldUserEmail);
                        }
                    }).exceptionally(answer::exceptionally);
        } else {
            throw new NoAccessException("Anonymous users can't update profiles of other users");
        }
    }

}
