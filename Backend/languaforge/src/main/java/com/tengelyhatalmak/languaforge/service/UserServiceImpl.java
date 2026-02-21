package com.tengelyhatalmak.languaforge.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder = new Argon2PasswordEncoder(5, 64, 2, 5, 2);


    @Autowired
    private UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findUserById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.getUserByUsername(username).orElse(null);
    }

    @Override
    public User updateUser(User user, Integer id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setAvatarUrl(user.getAvatarUrl());
        existingUser.setBio(user.getBio());
        existingUser.setPasswordHash(user.getPasswordHash());
        existingUser.setRoleId(user.getRoleId());
        existingUser.setLastLogin(user.getLastLogin());
        existingUser.setAnonymized(user.isAnonymized());
        return userRepository.save(existingUser);
    }

    @Override
    public User updateAvatarUrl(Integer id, String avatarUrl) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setAvatarUrl(avatarUrl);

        return userRepository.save(existingUser);
    }

    @Override
    public User updateProfileFields(Integer id, String username, String bio) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(username != null && !username.isBlank()) {
            existingUser.setUsername(username);
        }
        if(bio != null ) {
            existingUser.setBio(bio);
        }


        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUserById(Integer id) {
        System.out.println("Deleting user with id: " + id);
        userRepository.deleteById(id);
    }

    @Override
    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    @Override
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
