package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final EmailService emailService;

    public ResponseEntity<User> registerUser(User user) {
        Optional<User> userByUsername;
        try {
            userByUsername = userRepository.getUserByUsername(user.getUsername());
        } catch (EmptyResultDataAccessException e) {
            userByUsername = Optional.empty();
        }

        if (userByUsername.isPresent()) {
            return new ResponseEntity<User>(userByUsername.get(), HttpStatus.CONFLICT);
        } else {
            user.setPasswordHash(userService.encodePassword(user.getPasswordHash()));
            user.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
            userService.saveUser(user);

            String activationToken = UUID.randomUUID().toString();

            // TODO: Save token to user or separate table
            emailService.sendActivationEmail(user.getEmail(), user.getUsername(), activationToken);


            return new ResponseEntity<>(user, HttpStatus.CREATED);
        }}



}
