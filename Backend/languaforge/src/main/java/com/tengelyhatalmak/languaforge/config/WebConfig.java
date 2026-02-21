package com.tengelyhatalmak.languaforge.config;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "avatars")
                .toAbsolutePath();

        System.out.println("=== Serving avatars from: " + uploadDir.toUri());

        registry.addResourceHandler("/uploads/avatars/**")
                .addResourceLocations(uploadDir.toUri().toString() + "/");
    }
}
