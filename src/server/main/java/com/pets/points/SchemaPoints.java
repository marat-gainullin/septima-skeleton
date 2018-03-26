package com.pets.points;

import com.septima.application.endpoint.SqlEntitiesSchemaEndPoint;

import javax.servlet.annotation.WebServlet;

@WebServlet(asyncSupported = true, urlPatterns = "/schema/*")
public class SchemaPoints extends SqlEntitiesSchemaEndPoint {
}
