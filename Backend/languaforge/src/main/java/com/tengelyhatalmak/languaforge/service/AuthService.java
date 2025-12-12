package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.dto.LoginRequestDTO;
import com.tengelyhatalmak.languaforge.dto.LoginResponseDTO;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import com.tengelyhatalmak.languaforge.util.JWTUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.util.Times;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
    private final JWTUtil jwtUtil;

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
            user.setActivationToken(activationToken);
            user.setIsActive(false);
            userRepository.save(user);

            emailService.sendActivationEmail(user.getEmail(), user.getUsername(), activationToken);


            return new ResponseEntity<>(user, HttpStatus.CREATED);
        }}


    public ResponseEntity<?> activateUser(String token) {
        User user = userRepository.findByActivationToken(token);
        if (user == null) {
            return new ResponseEntity<>("Invalid activation token", HttpStatus.BAD_REQUEST);
        }

        if (user.getIsActive()){
            return new ResponseEntity<>("Account already activated", HttpStatus.BAD_REQUEST);
        }

        user.setIsActive(true);
        user.setActivationToken(null);
        userService.saveUser(user);

        return new ResponseEntity<>("Account activated successfully", HttpStatus.OK);
    }


    @Transactional
    public ResponseEntity<?> loginUser(LoginRequestDTO loginRequest){
        String identifier = loginRequest.getIdentifier();
        Optional<User> userOptional = Optional.empty();

        try {
            userOptional = userRepository.getUserByUsername(identifier);
        } catch (Exception e) {
        }

        if (userOptional.isEmpty()) {
            try {
                userOptional = userRepository.getUserByEmail(identifier);
            } catch (Exception e) {
            }
        }

        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        User user = userOptional.get();

        if (!user.getIsActive()) {
            return new ResponseEntity<>("Activate your account first!", HttpStatus.FORBIDDEN);
        }

        if (!userService.checkPassword(loginRequest.getPassword(), user.getPasswordHash())) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        user.setLastLogin(java.sql.Timestamp.valueOf(LocalDateTime.now()));
        userService.saveUser(user);
        LoginResponseDTO response = new LoginResponseDTO(accessToken, refreshToken, user.getUsername());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }




    @Transactional
    public ResponseEntity<?> refreshToken(String refreshToken){
        if(!jwtUtil.validateToken(refreshToken)){
            return new ResponseEntity<>("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtil.extractUsername(refreshToken);
        String newAccessToken = jwtUtil.generateAccessToken(username);

        return new ResponseEntity<>(new LoginResponseDTO(newAccessToken, refreshToken, username), HttpStatus.OK);
    }
}
