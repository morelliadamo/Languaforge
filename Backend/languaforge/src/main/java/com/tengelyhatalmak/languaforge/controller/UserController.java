package com.tengelyhatalmak.languaforge.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.findUserById(id);
    }

    @PostMapping("/createUser")
    public User createUser(@RequestBody Map<String, String> requestBody) {
        User user = new User();
        user.setUsername(requestBody.get("username"));
        user.setEmail(requestBody.get("email"));
        user.setPasswordHash(userService.encodePassword(requestBody.get("passwordHash")));

        System.out.println("Creating user with encoded password: " + user.getPasswordHash());
        return userService.saveUser(user);
    }
    @PutMapping("/updateUser/{id}")
    public User updateUser(@RequestBody User user, @PathVariable Integer id) {
        return userService.updateUser(user, id);
    }

    @PatchMapping("/softDeleteUser/{id}")
    public User softDeleteUser(@PathVariable Integer id){
        User user = userService.findUserById(id);
        user.setDeleted(true);
        return userService.saveUser(user);
    }

    @PatchMapping("/restoreUser/{id}")
    public User restoreUser(@PathVariable Integer id){
        User user = userService.findUserById(id);
        user.setDeleted(false);
        return userService.saveUser(user);
    }

    @DeleteMapping("/hardDeleteUser/{id}")
    public String hardDeleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return "User with id " + id + " has been deleted";
    }
}
