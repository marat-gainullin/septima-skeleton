package com.pets.points.users;

import com.septima.application.AsyncEndPoint;
import com.septima.application.endpoint.Answer;
import com.septima.application.exceptions.InvalidRequestException;
import com.septima.queries.SqlQuery;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.pets.points.users.UsersPoint.md5;

@WebServlet(asyncSupported = true, urlPatterns = "/complete-e-mail-verification")
public class EmailVerificationCompletionPoint extends AsyncEndPoint {

    private static String redirectTo(HttpServletRequest req) {
        String baseUrl = UsersPoint.requestBaseUrl(req);
        return baseUrl.substring(0, baseUrl.length() - "/complete-e-mail-verification".length());
    }

    private static void verified(Answer answer, String email) {
        try {
            answer.getResponse().setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
            answer.getResponse().setHeader("Location", redirectTo(answer.getRequest()) + "#e-mail-verified-" + URLEncoder.encode(email, StandardCharsets.UTF_8.name()));
            answer.getContext().complete();
        } catch (UnsupportedEncodingException ex) {
            throw new IllegalStateException(ex);
        }
    }

    private static void verificationFailed(Answer answer) {
        answer.getResponse().setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
        answer.getResponse().setHeader("Location", redirectTo(answer.getRequest()) + "#e-mail-verification-failed");
        answer.getContext().complete();
    }

    @Override
    public void get(Answer answer) {
        if (answer.getRequest().getParameterMap().containsKey("a") && answer.getRequest().getParameterMap().containsKey("b")) {
            SqlQuery clearNonces = entities.loadQuery("commands/users/clear-nonces-by-email");
            SqlQuery addRole = entities.loadQuery("commands/users/add-role");
            String email = answer.getRequest().getParameter("a");
            String md5Hash = answer.getRequest().getParameter("b");
            SqlQuery nonceByEmail = entities.loadQuery("entities/users/nonce-by-email");
            nonceByEmail.requestData(Map.of(
                    "email", email,
                    "moment", new Date()
            ))
                    .thenApply(nonces -> {
                        boolean verified = nonces.stream().anyMatch(nonce -> md5Hash.equals(md5(email + nonce.get("userNonce"))));
                        if (verified) {
                            return addRole.start(Map.of(
                                    "email", email,
                                    "role", "registered"
                            ));
                        } else {
                            throw new InvalidRequestException("Email verification URL is invalid");
                        }
                    })
                    .thenCompose(Function.identity())
                    .thenAccept(affected -> verified(answer, email))
                    .exceptionally(ex -> {
                        verificationFailed(answer);
                        Logger.getLogger(EmailVerificationCompletionPoint.class.getName()).log(Level.SEVERE, null, ex);
                        return null;
                    })
                    .thenAccept(v -> clearNonces.start(Map.of("email", email)));
        } else {
            throw new InvalidRequestException("Parameters 'a' and 'b' are required for email verification");
        }
    }
}
