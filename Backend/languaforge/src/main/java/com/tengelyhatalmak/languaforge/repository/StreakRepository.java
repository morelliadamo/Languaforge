package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StreakRepository extends JpaRepository<Streak, Integer> {

    @Query("SELECT s FROM Streak s WHERE s.user.id = :userId AND s.isDeleted = false")
    Streak findStreakByUserID(Integer userId);


    @Query("SELECT s.currentStreak FROM Streak s WHERE s.user.id = :userId AND s.isDeleted = false")
    Integer getCurrentStreakNumberByUserID(Integer userId);


}
