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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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

    public static String md5(String aValue) {
        try {
            byte[] digest = MessageDigest.getInstance("MD5").digest(aValue.getBytes(StandardCharsets.UTF_8));
            //digested to hex string
            StringBuilder sb = new StringBuilder();
            for (byte d : digest) {
                sb.append(Integer.toString((d & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
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

    public static String requestBaseUrl(HttpServletRequest req) {
        try {
            String pathInfo = req.getPathInfo();
            String encodedPathInfo = pathInfo != null ? "/" + URLEncoder.encode(pathInfo.substring(1), StandardCharsets.UTF_8.name()) : null;
            String requestUrl = req.getRequestURL().toString();
            return requestUrl.substring(0, requestUrl.length() - (encodedPathInfo != null ? encodedPathInfo.length() : 0));
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException(ex);
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
        String pathInfo = answer.getRequest().getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty() && pathInfo.length() > 1) {
            String userEmail = pathInfo.substring(1);
            SqlQuery usersQuery = entities.loadQuery("entities/users/user-by-email");
            usersQuery.requestData(Map.of("email", userEmail))
                    .thenAccept(users -> {
                        if (users.size() == 1) {
                            Map<String, Object> userBody = new HashMap<>(users.get(0));
                            userBody.put("confirmed", answer.getRequest().isUserInRole("confirmed"));
                            answer.withJsonObject(userBody);
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
                    String userName = (String) userBody.get("userName");
                    String password = (String) userBody.get("password");
                    if (email != null && !email.isEmpty() && password != null && !password.isEmpty()) {
                        return CompletableFuture.allOf(entities.bindChanges(List.of(
                                new InstanceAdd("commands/users/user-and-roles", Map.of(
                                        "userName", userName != null && !userName.isEmpty() ? userName : email,
                                        "email", email,
                                        "digest", md5(password),
                                        "roleUserEmail", email,
                                        "role", "registered"
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
                    String requestBaseUrl = requestBaseUrl(answer.getRequest());
                    answer.getResponse().setHeader("Location", "/users/" + email);
                    answer.getResponse().setStatus(HttpServletResponse.SC_CREATED);
                    answer.getContext().complete();
                    startEmailVerification(requestBaseUrl, email);
                })
                .exceptionally(answer::exceptionally);
    }

    @Override
    public void put(Answer answer) {
        String pathInfo = answer.getRequest().getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty() && pathInfo.length() > 1) {
            String oldUserEmail = pathInfo.substring(1);
            Principal principal = answer.getRequest().getUserPrincipal();
            if (principal != null && answer.getRequest().isUserInRole("admin") || oldUserEmail.equalsIgnoreCase(principal.getName())) {
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
            throw new InvalidRequestException("User email should be specified in the form of 'users/{user-e-mail-here}'");
        }
    }

    @Override
    public void delete(Answer answer) {
        String pathInfo = answer.getRequest().getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty() && pathInfo.length() > 1) {
            String userEmail = pathInfo.substring(1);
            Principal principal = answer.getRequest().getUserPrincipal();
            if (principal != null) {
                if (answer.getRequest().isUserInRole("admin") || userEmail.equalsIgnoreCase(principal.getName())) {
                    SqlQuery userDeleteQuery = entities.loadQuery("commands/users/delete-user-by-email");
                    userDeleteQuery.start(Map.of("email", userEmail))
                            .thenAccept(affected -> {
                                if (affected > 0) {
                                    HttpServletRequest request = answer.getRequest();
                                    HttpSession session = request.getSession(false);
                                    if (session != null) {
                                        session.invalidate();
                                        answer.ok();
                                    } else {
                                        answer.erroneous("No logged in user");
                                    }
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
        SqlQuery addNonce = entities.loadQuery("commands/users/add-nonce");
        addNonce.start(Map.of(
                "email", email,
                "nonce", nonce,
                "expiration", new Date(new Date().getTime() + 2 * 60 * 60 * 100) // 2 Hours
        ))
                .thenApply(affected -> {
                    String verifyEmailUrl = requestBaseUrl.substring(0, requestBaseUrl.length() - "/users".length()) +
                            "/complete-e-mail-verification" +
                            "?a=" + urlEncode(email) +
                            "&b=" + urlEncode(md5(email + nonce));
                    return Mail.getInstance().send(
                            "no-reply@your.awesome.mail.box.io",
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
        SqlQuery userUpdateQuery = entities.loadQuery("commands/users/update-user-by-email");
        Map<String, Object> params = new HashMap<>(userBody);
        params.put("oldEmail", oldUserEmail);
        return userUpdateQuery.start(params);
    }

    private CompletableFuture<Integer> changePassword(String oldUserEmail, Map<String, Object> newPasswordBody) {
        SqlQuery passwordUpdateQuery = entities.loadQuery("commands/users/change-password-by-email");
        return passwordUpdateQuery.start(Map.of(
                "digest", md5((String) newPasswordBody.get("password")),
                "newDigest", md5((String) newPasswordBody.get("newPassword")),
                "email", oldUserEmail
        ));
    }

}
