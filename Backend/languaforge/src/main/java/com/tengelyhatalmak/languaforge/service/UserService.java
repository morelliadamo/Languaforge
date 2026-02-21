package com.tengelyhatalmak.languaforge.service;

import java.util.List;

import com.tengelyhatalmak.languaforge.model.User;

public interface UserService {
    User saveUser(User user);
    List<User> findAllUsers();
    User findUserById(Integer id);
    User findUserByUsername(String username);

    User updateUser(User user, Integer id);
    User updateAvatarUrl(Integer id, String avatarUrl);
    User updateProfileFields(Integer id, String username, String bio);

    void deleteUserById(Integer id);

    String encodePassword(String password);
    boolean checkPassword(String rawPassword, String encodedPassword);
}
