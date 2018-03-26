package com.pets.points.users;

import com.septima.application.AsyncEndPoint;
import com.septima.application.endpoint.Answer;
import com.septima.application.exceptions.InvalidRequestException;
import com.septima.queries.SqlQuery;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.pets.points.users.UsersPoint.md5;

@WebServlet(asyncSupported = true, urlPatterns = "/complete-e-mail-verification")
public class EmailVerificationCompletionPoint extends AsyncEndPoint {

    private static void verified(Answer answer) {
        String requestUrl = answer.getRequest().getRequestURL().toString();
        String requestBaseUrl = requestUrl.substring(0, requestUrl.length() - answer.getRequest().getPathInfo().length());
        answer.getResponse().setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
        answer.getResponse().setHeader("Location", requestBaseUrl + "#e-mail-verified");
        answer.getContext().complete();
    }

    private static void verificationFailed(Answer answer) {
        String requestUrl = answer.getRequest().getRequestURL().toString();
        String requestBaseUrl = requestUrl.substring(0, requestUrl.length() - answer.getRequest().getPathInfo().length());
        answer.getResponse().setStatus(HttpServletResponse.SC_TEMPORARY_REDIRECT);
        answer.getResponse().setHeader("Location", requestBaseUrl + "#e-mail-verification-failed");
        answer.getContext().complete();
    }

    @Override
    public void get(Answer answer) {
        if (answer.getRequest().getParameterMap().containsKey("a") && answer.getRequest().getParameterMap().containsKey("b")) {
            SqlQuery clearNonces = entities.loadQuery("entities/users/clear-nonces-by-email");
            SqlQuery addRole = entities.loadQuery("entities/users/add-role");
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
                    .thenAccept(affected -> verified(answer))
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
