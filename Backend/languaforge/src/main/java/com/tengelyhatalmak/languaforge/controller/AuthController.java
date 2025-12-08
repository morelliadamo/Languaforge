package com.tengelyhatalmak.languaforge.controller;


import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.AuthService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

//    @PostMapping("/login")
//    public ResponseEntity<String> loginUser(@RequestBody User user) {
//
//    }
}
