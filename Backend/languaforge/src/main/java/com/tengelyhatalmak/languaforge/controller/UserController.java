package com.tengelyhatalmak.languaforge.controller;

import java.util.List;

import com.tengelyhatalmak.languaforge.util.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<User> getAllUsers() {
        System.out.println("user controller reached");
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findUserById(id);
    }

    @PostMapping("/createUser")
    public User createUser(@RequestBody User user) {
        user.setPasswordHash(userService.encodePassword(user.getPasswordHash()));
        System.out.println("Creating user with encoded password: " + user.getPasswordHash());
        return userService.saveUser(user);
    }

    @PutMapping("/updateUser/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Long id) {
        return userService.updateUser(user, id);
    }

    @PatchMapping("/softDeleteUser/{id}")
    public User softDeleteUser(@PathVariable Long id){
        User user = userService.findUserById(id);
        user.setDeleted(true);
        return userService.saveUser(user);
    }

    @DeleteMapping("/hardDeleteUser/{id}")
    public String hardDeleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return "User with id " + id + " has been deleted";
    }







}
