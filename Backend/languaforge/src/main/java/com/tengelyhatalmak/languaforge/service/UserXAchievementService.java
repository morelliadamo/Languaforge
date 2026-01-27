package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.*;
import com.tengelyhatalmak.languaforge.repository.UserXAchievementRepository;

import java.util.List;

public interface UserXAchievementService {
    UserXAchievement saveUserXAchievement(UserXAchievement userXAchievement);
    List<UserXAchievement> findAllUserXAchievements();
    UserXAchievement findUserXAchievementById(Integer id);

    List<UserXAchievement> findUserXAchievementsByUsername(String username);

    List<User> findUsersByAchievementId(Integer achievementId);
    List<User> findUsersByAchievementName(String achievementName);
    List<Achievement> findAchievementsByUserId(Integer userId);
    List<Achievement> findAchievementsByUsername(String username);

    UserXAchievement updateUserXAchievement(UserXAchievement userXAchievement, Integer id);

    UserXAchievement softDeleteUserXAchievement(Integer id);
    void deleteUserXAchievementById(Integer id);
}
