package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXAchievement;
import com.tengelyhatalmak.languaforge.service.UserXAchievementService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public UserXAchievement getUserXAchievementById(Integer id){
        return userXAchievementService.findUserXAchievementById(id);
    }

    @GetMapping("/user/{username}")
    public List<Achievement> getAchievementsByUserName(String username){
        return userXAchievementService.findAchievementsByUsername(username);
    }

    @GetMapping("/achievement/{achievementName}")
    public List<User> getUsersByAchievementName(String achievementName){
        return userXAchievementService.findUsersByAchievementName(achievementName);
    }

    @PostMapping("/createUserXAchievement")
    public UserXAchievement createUserXAchievement(UserXAchievement userXAchievement){
        return userXAchievementService.saveUserXAchievement(userXAchievement);
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
