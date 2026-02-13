package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Achievement;

import java.util.List;

public interface AchievementService {
    Achievement saveAchievement(Achievement achievement);
    List<Achievement> findAllAchievements();
    Achievement findAchievementById(Integer id);
    Achievement updateAchievement(Achievement achievement, Integer id);
    void deleteAchievement(Integer id);
    Achievement softDeleteAchievement(Integer id);
    Achievement restoreAchievement(Integer id);

}
