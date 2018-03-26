package com.pets.utils;

import com.septima.application.Config;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

public class Mail {

    private static final String DEFAULT_LOOKUP_PLACE = "java:comp/env";
    private static final String DEFAULT_MAIL_SESSION_NAME = "mail/Session";
    private static final String DEFAULT_CONTENT_TYPE = "text/plain; charset=utf-8";
    private static volatile Mail instance;
    private final Executor asyncMessagesSender;
    private final Executor futureExecutor;
    private final String lookup;
    private final String sessionName;

    public Mail(final String aLookup, final String aSessionName) {
        this(aLookup, aSessionName, mailTasksPerformer(32), ForkJoinPool.commonPool());
    }

    public Mail(final String aLookup, final String aSessionName, Executor aAsyncDataPuller, Executor aFutureExecutor) {
        super();
        lookup = aLookup;
        sessionName = aSessionName;
        asyncMessagesSender = aAsyncDataPuller;
        futureExecutor = aFutureExecutor;
    }

    private static ExecutorService mailTasksPerformer(final int aMaxParallelMessages) {
        AtomicLong threadNumber = new AtomicLong();
        ThreadPoolExecutor mailProcessor = new ThreadPoolExecutor(aMaxParallelMessages, aMaxParallelMessages,
                3L, TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(),
                r -> new Thread(r, "mail-" + threadNumber.incrementAndGet()));
        mailProcessor.allowCoreThreadTimeOut(true);
        return mailProcessor;
//        mailProcessor.shutdown();
//        mailProcessor.awaitTermination(30L, TimeUnit.SECONDS);
    }

    private static void init(Config aConfig) {
        if (instance != null) {
            throw new IllegalStateException("Mail can be initialized only once.");
        }
        instance = new Mail(DEFAULT_LOOKUP_PLACE, DEFAULT_MAIL_SESSION_NAME, mailTasksPerformer(aConfig.getMaximumMailThreads()), Config.lookupExecutor());
    }

    private static void done() {
        if (instance == null) {
            throw new IllegalStateException("Extra messages shutdown attempt detected.");
        }
        instance = null;
    }

    public static Mail getInstance() {
        return instance;
    }

    public CompletableFuture<Void> send(String from, String to, String subject, String body) {
        return send(from, to, subject, body, DEFAULT_CONTENT_TYPE);
    }

    public CompletableFuture<Void> send(String from, String to, String subject, String body, String contentType) {
        CompletableFuture<Void> sent = new CompletableFuture<>();
        asyncMessagesSender.execute(() -> {
            try {
                InitialContext initCtx = new InitialContext();
                Context envCtx = (Context) initCtx.lookup(lookup);
                Session session = (Session) envCtx.lookup(sessionName);
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(from));
                message.setRecipients(MimeMessage.RecipientType.TO, to);
                message.setSubject(subject);
                message.setContent(body, contentType);
                Transport.send(message);
                sent.completeAsync(() -> null, futureExecutor);
            } catch (MessagingException | NamingException ex) {
                futureExecutor.execute(() -> sent.completeExceptionally(ex));
            }
        });
        return sent;
    }


    @WebListener
    public static class Init implements ServletContextListener {
        @Override
        public void contextInitialized(ServletContextEvent anEvent) {
            init(Config.parse(anEvent.getServletContext()));
        }

        @Override
        public void contextDestroyed(ServletContextEvent anEvent) {
            done();
        }
    }
}