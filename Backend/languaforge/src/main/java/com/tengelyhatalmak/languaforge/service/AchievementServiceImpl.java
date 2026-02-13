package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.repository.AchievementRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AchievementServiceImpl implements AchievementService{

    @Autowired
    private AchievementRepository achievementRepository;


    @Override
    public Achievement saveAchievement(Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    @Override
    public List<Achievement> findAllAchievements() {
        return achievementRepository.findAll();
    }

    @Override
    public Achievement findAchievementById(Integer id) {
        return achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));
    }

    @Override
    public Achievement updateAchievement(Achievement achievement, Integer id) {
        Achievement existingAchievement = achievementRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Achievement not found"));

        existingAchievement.setName(achievement.getName());
        existingAchievement.setDescription(achievement.getDescription());
        existingAchievement.setIconUrl(achievement.getIconUrl());

        return achievementRepository.save(existingAchievement);
    }

    @Override
    public void deleteAchievement(Integer id) {
        System.out.println("Deleting achievement with id: "+id);
        achievementRepository.deleteById(id);
    }

    @Override
    public Achievement softDeleteAchievement(Integer id){
        Achievement achievementToSoftDelete = achievementRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Achievement not found"));

        achievementToSoftDelete.setIsDeleted(true);
        achievementToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return achievementRepository.save(achievementToSoftDelete);

    }

    @Override
    public Achievement restoreAchievement(Integer id) {
        Achievement achievement = achievementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Achievement not found"));

        achievement.setIsDeleted(false);
        achievement.setDeletedAt(null);

        return achievementRepository.save(achievement);
    }
}
