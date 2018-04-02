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
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.function.Function;

import static com.pets.points.users.UsersPoint.*;

@WebServlet(asyncSupported = true, urlPatterns = "/start-verify-e-mail/*")
public class EmailVerificationStartPoint extends AsyncEndPoint {

    private String emailVerificationTemplate;

    @Override
    public void init() {
        super.init();
        try {
            emailVerificationTemplate = loadResource("/mail/email-verification.html", StandardCharsets.UTF_8, System.lineSeparator());
        } catch (IOException ex) {
            throw new UncheckedIOException(ex);
        }
    }

    @Override
    public void get(Answer answer) {
        String pathInfo = answer.getRequest().getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty() && pathInfo.length() > 1) {
            String email = pathInfo.substring(1);
            String nonce = "nonce-" + new Random().nextInt(1048576);
            SqlQuery addNonce = entities.loadQuery("commands/users/add-nonce");
            addNonce
                    .start(Map.of(
                            "email", email,
                            "nonce", nonce,
                            "expiration", new Date(new Date().getTime() + 2 * 60 * 60 * 100) // 2 Hours
                    ))
                    .thenApply(affected -> {
                        String baseUrl = UsersPoint.requestBaseUrl(answer.getRequest());
                        String verifyEmailUrl = baseUrl.substring(0, baseUrl.length() - "/start-verify-e-mail".length()) +
                                "/complete-e-mail-verification" +
                                "?a=" + urlEncode(email) +
                                "&b=" + urlEncode(md5(email + nonce));
                        return Mail.getInstance().send(
                                "no-reply@your.awesome.mail.box.io",
                                email,
                                "Car online email verification",
                                emailVerificationTemplate.replaceAll("\\$\\{URL\\}", verifyEmailUrl),
                                "text/html"
                        );
                    })
                    .thenCompose(Function.identity())
                    .thenAccept(v -> answer.ok())
                    .exceptionally(answer::exceptionally);
        } else {
            throw new InvalidRequestException("User email should be specified in the form of 'start-verify-e-mail/{user-e-mail-here}'");
        }
    }
}
