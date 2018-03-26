package com.pets.points;

import com.septima.application.endpoint.SqlEntitiesCommitEndPoint;

import javax.servlet.annotation.WebServlet;

@WebServlet(asyncSupported = true, urlPatterns = "/commit")
public class CommitPoint extends SqlEntitiesCommitEndPoint {
}
