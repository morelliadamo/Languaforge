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
    public User updateUser(User user, Integer id) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setPasswordHash(user.getPasswordHash());
        existingUser.setRoleId(user.getRoleId());
        existingUser.setLastLogin(user.getLastLogin());
        existingUser.setAnonymized(user.isAnonymized());
        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUserById(Integer id) {
        System.out.println("Deleting user with id: " + id);
        userRepository.deleteById(id);
    }

    @Override
    public String encodePassword(String password) {
        Argon2PasswordEncoder passwordEncoder = new Argon2PasswordEncoder(5, 64, 2, 5, 2);
        return passwordEncoder.encode(password);
    }

}
