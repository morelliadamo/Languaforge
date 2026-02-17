package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXAchievement;
import com.tengelyhatalmak.languaforge.repository.AchievementRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import com.tengelyhatalmak.languaforge.repository.UserXAchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserXAchievementServiceImpl implements UserXAchievementService{

    @Autowired
    private UserXAchievementRepository userXAchievementRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserXAchievement saveUserXAchievement(UserXAchievement userXAchievement) {
        userXAchievement.setEarnedAt(Timestamp.valueOf(LocalDateTime.now()));
        userXAchievement.setAchievement(achievementRepository.findById(userXAchievement.getAchievementId())
                .orElseThrow(()-> new RuntimeException("Achievement not found with id: " + userXAchievement.getAchievementId())));
        userXAchievement.setUser(userRepository.findById(userXAchievement.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found with id: " + userXAchievement.getUserId())));

        return userXAchievementRepository.save(userXAchievement);
    }

    @Override
    public List<UserXAchievement> findAllUserXAchievements() {
        return userXAchievementRepository.findAll();
    }

    @Override
    public UserXAchievement findUserXAchievementById(Integer id) {
        return userXAchievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserXAchievement not found"));
    }

    @Override
    public List<UserXAchievement> findUserXAchievementsByUsername(String username) {
        return userXAchievementRepository.findUserXAchievementsByUsername(username);
    }

    @Override
    public List<User> findUsersByAchievementId(Integer achievementId) {
        return userXAchievementRepository.findUsersByAchievementId(achievementId);
    }

    @Override
    public List<User> findUsersByAchievementName(String achievementName) {
        return userXAchievementRepository.findUsersByAchievementName(achievementName);
    }

    @Override
    public List<Achievement> findAchievementsByUserId(Integer userId) {
        return userXAchievementRepository.findAchievementsByUserId(userId);
    }

    @Override
    public List<Achievement> findAchievementsByUsername(String username) {
        return userXAchievementRepository.findAchievementsByUsername(username);
    }

    @Override
    public Integer countUsersByAchievementId(Integer achievementId) {
        return userXAchievementRepository.countUserXAchievementByAchievementId(achievementId);
    }

    @Override
    public UserXAchievement updateUserXAchievement(UserXAchievement userXAchievement, Integer id) {
        UserXAchievement existingUserXAchievement = userXAchievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserXAchievement not found"));

        existingUserXAchievement.setUser(userXAchievement.getUser());
        existingUserXAchievement.setAchievement(userXAchievement.getAchievement());
        existingUserXAchievement.setEarnedAt(userXAchievement.getEarnedAt());
        return userXAchievementRepository.save(existingUserXAchievement);

    }

    @Override
    public UserXAchievement softDeleteUserXAchievement(Integer id) {
        UserXAchievement userXAchievementToSoftDelete = userXAchievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserXAchievement not found"));

        userXAchievementToSoftDelete.setIsDeleted(true);

        return userXAchievementRepository.save(userXAchievementToSoftDelete);
    }

    @Override
    public void deleteUserXAchievementById(Integer id) {
        System.out.println("Deleting UserXAchievement with id: " + id);
        userXAchievementRepository.deleteById(id);
    }
}
