package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserXAchievementRepository extends JpaRepository<UserXAchievement, Integer> {
    @Query("SELECT uxa FROM UserXAchievement uxa JOIN uxa.user u WHERE u.username = :username AND uxa.isDeleted = false")
    List<UserXAchievement> findUserXAchievementsByUsername(String username);


    @Query("SELECT DISTINCT uxa.user FROM UserXAchievement uxa WHERE uxa.achievementId = :achievementId AND uxa.isDeleted = false")
    List<User> findUsersByAchievementId(@Param("achievementId") Integer achievementId);


    @Query("SELECT DISTINCT uxa.user FROM UserXAchievement uxa JOIN uxa.achievement a WHERE a.name = :achievementName AND uxa.isDeleted = false")
    List<User> findUsersByAchievementName(@Param("achievementName") String achievementName);

    @Query("SELECT DISTINCT uxa.achievement FROM UserXAchievement uxa WHERE uxa.userId = :userId AND uxa.isDeleted = false")
    List<Achievement> findAchievementsByUserId(@Param("userId") Integer userId);

    @Query("SELECT DISTINCT uxa.achievement FROM UserXAchievement uxa JOIN uxa.user u WHERE u.username = :username AND uxa.isDeleted = false")
    List<Achievement> findAchievementsByUsername(@Param("username") String username);
}
