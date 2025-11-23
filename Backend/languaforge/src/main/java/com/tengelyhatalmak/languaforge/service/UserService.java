package com.tengelyhatalmak.languaforge.service;

import java.util.List;

import com.tengelyhatalmak.languaforge.model.User;

public interface UserService {
    User saveUser(User user);
    List<User> findAllUsers();
    User findUserById(Long id);
    User updateUser(User user, Long id);
    void deleteUserById(Long id);

    String encodePassword(String password);
}
