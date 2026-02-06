package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Streak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StreakRepository extends JpaRepository<Streak, Integer> {

    @Query("SELECT s FROM Streak s WHERE s.user.id = :userId AND s.isDeleted = false")
    public Streak findStreakByUserID(Integer userId);

}
