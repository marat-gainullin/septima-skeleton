package com.pets.points;

import com.septima.application.endpoint.LoggedInEndPoint;

import javax.servlet.annotation.WebServlet;

@WebServlet(asyncSupported = true, urlPatterns = "/logged-in")
public class LoggedInPoint extends LoggedInEndPoint {
}
