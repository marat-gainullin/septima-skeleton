package com.pets.points;

import com.septima.application.endpoint.SqlEntitiesParametersEndPoint;

import javax.servlet.annotation.WebServlet;

@WebServlet(asyncSupported = true, urlPatterns = "/parameters/*")
public class ParametersPoints extends SqlEntitiesParametersEndPoint {
}
