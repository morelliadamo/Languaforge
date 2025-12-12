package com.tengelyhatalmak.languaforge.controller;


import com.tengelyhatalmak.languaforge.dto.LoginRequestDTO;
import com.tengelyhatalmak.languaforge.dto.RefreshTokenRequestDTO;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    @Transactional
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return authService.registerUser(user);
    }

    @GetMapping("/activate")
    public ResponseEntity<?> activateUser(@RequestParam String token) {
        return authService.activateUser(token);
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
            return authService.loginUser(loginRequest);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequest){
        return authService.refreshToken(refreshTokenRequest.getRefreshToken());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Not logged in"));
    }

}
