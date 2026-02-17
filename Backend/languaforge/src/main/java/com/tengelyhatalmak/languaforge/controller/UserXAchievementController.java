package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXAchievement;
import com.tengelyhatalmak.languaforge.service.UserXAchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userXachievements")
public class UserXAchievementController {

    @Autowired
    private UserXAchievementService userXAchievementService;


    @GetMapping("/")
    public List<UserXAchievement> getUserXAchievements(){
        return userXAchievementService.findAllUserXAchievements();
    }

    @GetMapping("/{id}")
    public UserXAchievement getUserXAchievementById(@PathVariable Integer id){
        return userXAchievementService.findUserXAchievementById(id);
    }


    @GetMapping("/user/{userId}")
    public List<Achievement> getAchievementsByUserId(@PathVariable Integer userId){
        return userXAchievementService.findAchievementsByUserId(userId);
    }

    @GetMapping("/achievement/{achievementName}")
    public List<User> getUsersByAchievementName(@PathVariable String achievementName){
        return userXAchievementService.findUsersByAchievementName(achievementName);
    }

    @GetMapping("/achievement/{achievementId}/count")
    public Integer countUsersByAchievementId(@PathVariable Integer achievementId){
        return userXAchievementService.countUsersByAchievementId(achievementId);
    }

    @PostMapping("/createUserXAchievement")
    public ResponseEntity<UserXAchievement> createUserAchievement(@RequestBody UserXAchievement request) {
        if (request.getAchievementId() == null) {
            throw new IllegalArgumentException("achievementId is required");
        }
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("userId is required");
        }

        UserXAchievement saved = userXAchievementService.saveUserXAchievement(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/updateUserXAchievement/{id}")
    public UserXAchievement updateUserXAchievement(@RequestBody UserXAchievement userXAchievement, @PathVariable Integer id){
        return userXAchievementService.updateUserXAchievement(userXAchievement, id);
    }

    @PatchMapping("/softDeleteUserXAchievement/{id}")
    public UserXAchievement softDeleteUserXAchievement(@PathVariable Integer id){
        return userXAchievementService.softDeleteUserXAchievement(id);
    }

    @DeleteMapping("/hardDeleteUserXAchievement/{id}")
    public void hardDeleteUserXAchievement(@PathVariable Integer id){
        userXAchievementService.deleteUserXAchievementById(id);
    }
}
