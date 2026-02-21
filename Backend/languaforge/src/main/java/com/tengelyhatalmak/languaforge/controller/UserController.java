package com.tengelyhatalmak.languaforge.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.tengelyhatalmak.languaforge.model.UserXCourse;
import com.tengelyhatalmak.languaforge.service.CourseService;
import com.tengelyhatalmak.languaforge.service.UserXCourseService;
import org.apache.coyote.Response;
import org.bouncycastle.util.Times;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.UserService;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserXCourseService userXCourseService;


    @Autowired
    private CourseService courseService;

    @GetMapping("/")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.findUserById(id);
    }

    @GetMapping("/{id}/name")
    public String getUsernameById(@PathVariable Integer id) {
        return userService.findUserById(id).getUsername();
    }



    @PostMapping("/createUser")
    public User createUser(@RequestBody Map<String, String> requestBody) {
        User user = new User();
        user.setUsername(requestBody.get("username"));
        user.setEmail(requestBody.get("email"));
        user.setPasswordHash(userService.encodePassword(requestBody.get("passwordHash")));
        user.getUserXCourses().add(userXCourseService.saveUserXCourse(new UserXCourse(user, courseService.findCourseById(3)))); //Currently only course with id 3 is available
        return userService.saveUser(user);
    }
    @PutMapping("/updateUser/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Integer id) {
        return userService.updateUser(user, id);
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Integer id,
            @RequestParam("avatar") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !List.of(
                "image/jpeg", "image/png", "image/webp", "image/gif"
        ).contains(contentType)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type"));
        }

        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File too large (max 2MB)"));
        }

        try {
            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "avatars")
                    .toAbsolutePath();
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            User existingUser = userService.findUserById(id);
            String existingAvatarUrl = existingUser.getAvatarUrl();
            if (existingAvatarUrl != null && existingAvatarUrl.contains("/users/avatars/")) {
                String oldFilename = existingAvatarUrl.substring(existingAvatarUrl.lastIndexOf("/") + 1);
                Path oldFilePath = uploadDir.resolve(oldFilename);
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                    System.out.println("=== Deleted old avatar: " + oldFilePath);
                }
            }

            String extension = contentType.split("/")[1];
            String filename = "avatar_" + id + "_" + UUID.randomUUID() + "." + extension;
            Path filePath = uploadDir.resolve(filename);
            Files.write(filePath, file.getBytes());

            String avatarUrl = "http://localhost:8080/users/avatars/" + filename;
            userService.updateAvatarUrl(id, avatarUrl);

            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save file: " + e.getMessage()));
        }
    }





    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        try {
            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "avatars")
                    .toAbsolutePath();
            Path filePath = uploadDir.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                System.out.println("=== File not found: " + filePath);
                return ResponseEntity.notFound().build();
            }

            // Detect content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) contentType = "application/octet-stream";

            System.out.println("=== Serving file: " + filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            System.out.println("=== Error serving avatar: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    @PatchMapping("/updateUserProfile/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Integer id, @RequestBody Map<String, String> body){
        try {
            User updated = userService.updateProfileFields(
                    id,
                    body.get("username"),
                    body.get("bio")
            );
            return ResponseEntity.ok(Map.of(
                    "username", updated.getUsername() != null ? updated.getUsername() : "",
                    "bio", updated.getBio() != null ? updated.getBio() : ""
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PatchMapping("/softDeleteUser/{id}")
    public User softDeleteUser(@PathVariable Integer id){
        User user = userService.findUserById(id);
        user.setDeleted(true);
        user.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
        return userService.saveUser(user);
    }

    @PatchMapping("/restoreUser/{id}")
    public Object restoreUser(@PathVariable Integer id){
        User user = userService.findUserById(id);
        if (!user.isDeleted()){
            return HttpStatus.BAD_REQUEST+": User with id: " +user.getId()+" is not soft deleted";
        }
        user.setDeleted(false);
        return userService.saveUser(user);
    }

    @DeleteMapping("/hardDeleteUser/{id}")
    public String hardDeleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return "User with id " + id + " has been deleted";
    }
}
