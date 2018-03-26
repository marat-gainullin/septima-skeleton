package com.pets.points;

import com.septima.application.endpoint.LogoutEndPoint;

import javax.servlet.annotation.WebServlet;

@WebServlet(asyncSupported = true, urlPatterns = "/logout")
public class LogoutPoint extends LogoutEndPoint {
}
