package com.tengelyhatalmak.languaforge.service;

import java.util.List;

import com.tengelyhatalmak.languaforge.model.User;

public interface UserService {
    User saveUser(User user);
    List<User> findAllUsers();
    User findUserById(Integer id);
    User updateUser(User user, Integer id);
    void deleteUserById(Integer id);

    String encodePassword(String password);
}
