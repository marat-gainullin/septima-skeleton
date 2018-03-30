package com.pets.points.users;

import com.pets.utils.Mail;
import com.septima.application.AsyncEndPoint;
import com.septima.application.endpoint.Answer;
import com.septima.application.exceptions.InvalidRequestException;
import com.septima.queries.SqlQuery;

import javax.servlet.annotation.WebServlet;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;

import static com.pets.points.users.UsersPoint.*;

@WebServlet(asyncSupported = true, urlPatterns = "/start-password-recover/*")
public class PasswordRecoverStartPoint extends AsyncEndPoint {

    private String recoverPasswordTemplate;

    @Override
    public void init() {
        super.init();
        try {
            recoverPasswordTemplate = loadResource("/mail/recover-password.html", StandardCharsets.UTF_8, System.lineSeparator());
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    @Override
    public void get(Answer answer) {
        String pathInfo = answer.getRequest().getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty() && pathInfo.length() > 1) {
            Principal principal = answer.getRequest().getUserPrincipal();
            if (principal == null) {
                String email = pathInfo.substring(1);
                String nonce = "nonce-" + new Random().nextInt(1048576);
                SqlQuery addNonce = entities.loadQuery("commands/users/add-password-nonce");
                addNonce.start(Map.of(
                        "email", email,
                        "nonce", nonce,
                        "expiration", new Date(new Date().getTime() + 2 * 60 * 60 * 100) // 2 Hours
                ))
                        .thenApply(affected -> {
                            String baseUrl = UsersPoint.requestBaseUrl(answer.getRequest());
                            String restorePasswordUrl = baseUrl.substring(0, baseUrl.length() - "/start-password-recover".length()) +
                                    "?a=" + urlEncode(email) +
                                    "&b=" + urlEncode(md5(email + nonce));
                            return Mail.getInstance().send(
                                    "no-reply@codesolver.io",
                                    email,
                                    "Car online password recover",
                                    recoverPasswordTemplate.replaceAll("\\$\\{URL\\}", restorePasswordUrl),
                                    "text/html"
                            );
                        })
                        .thenCompose(Function.identity())
                        .thenAccept(v -> answer.ok())
                        .exceptionally(answer::exceptionally);
            } else {
                throw new InvalidRequestException("Only anonymous users can complete password recovery process");
            }
        } else {
            throw new InvalidRequestException("User email should be specified in the form of 'start-password-recover/{user-e-mail-here}'");
        }
    }

}
