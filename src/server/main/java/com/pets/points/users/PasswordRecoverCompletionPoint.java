package com.pets.points.users;

import com.septima.application.AsyncEndPoint;
import com.septima.application.endpoint.Answer;
import com.septima.application.exceptions.InvalidRequestException;
import com.septima.application.exceptions.NoInstanceException;
import com.septima.queries.SqlQuery;

import javax.servlet.annotation.WebServlet;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.pets.points.users.UsersPoint.md5;

@WebServlet(asyncSupported = true, urlPatterns = "/complete-password-recover/*")
public class PasswordRecoverCompletionPoint extends AsyncEndPoint {

    @Override
    public void get(Answer answer) {
        if (answer.getRequest().getParameterMap().containsKey("a") && answer.getRequest().getParameterMap().containsKey("b") && answer.getRequest().getParameterMap().containsKey("c")) {
            SqlQuery clearNonces = entities.loadQuery("commands/users/clear-password-nonces-by-email");
            String email = answer.getRequest().getParameter("a");
            String md5Hash = answer.getRequest().getParameter("b");
            String newPassword = answer.getRequest().getParameter("c");
            SqlQuery nonceByEmail = entities.loadQuery("entities/users/password-nonce-by-email");
            nonceByEmail.requestData(Map.of(
                    "email", email,
                    "moment", new Date()
            ))
                    .thenApply(nonces -> {
                        boolean allowed = nonces.stream().anyMatch(nonce -> md5Hash.equals(md5(email + nonce.get("userNonce"))));
                        if (allowed) {
                            SqlQuery passwordRecoverQuery = entities.loadQuery("commands/users/recover-password-by-email");
                            return passwordRecoverQuery.start(Map.of(
                                    "newDigest", md5(newPassword),
                                    "email", email
                            ));
                        } else {
                            throw new InvalidRequestException("Password recovering URL is invalid");
                        }
                    })
                    .thenCompose(Function.identity())
                    .thenAccept(affected -> {
                        if (affected > 0) {
                            answer.ok();
                        } else {
                            throw new NoInstanceException("users", "email", email);
                        }
                    })
                    .exceptionally(answer::exceptionally)
                    .thenAccept(v -> clearNonces.start(Map.of("email", email)))
                    .exceptionally(ex -> {
                        Logger.getLogger(PasswordRecoverCompletionPoint.class.getName()).log(Level.SEVERE, null, ex);
                        return null;
                    });
        } else {
            throw new InvalidRequestException("Parameters 'a', 'b' and 'c' are required for password recovering");
        }
    }
}
