package com.pets.points.users;

import com.septima.model.Id;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@WebServlet("/avatars")
@MultipartConfig(
        maxFileSize = 1024 * 1024 * 4,
        location = "/"
)
public class AvatarsUploadPoint extends HttpServlet {

    private static String transformFileName(String fileName) {
        int dotAt = fileName.lastIndexOf('.');
        String name;
        String ext;
        if (dotAt > -1) {
            name = fileName.substring(0, dotAt);
            ext = fileName.substring(dotAt, fileName.length());
        } else {
            name = fileName;
            ext = "";
        }
        return name + "-" + Id.nextExtended() + ext;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Part avatar = req.getPart("avatar");
        if (avatar != null) {
            Path contextRootPath = Paths.get(req.getServletContext().getRealPath("/"));
            Path avatarsPath = contextRootPath.resolve("avatars");
            avatarsPath.toFile().mkdirs();
            String transformedFileName = transformFileName(Paths.get(avatar.getSubmittedFileName()).getFileName().toString());
            Path avatarPath = avatarsPath.resolve(transformedFileName);
            avatar.write(avatarPath.toString());
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.setHeader("Location", UsersPoint.requestBaseUrl(req) + "/" + transformedFileName);
        } else {
            throw new IllegalArgumentException("Part 'avatar' should be uploaded as avatar image upload request.");
        }
    }
}
