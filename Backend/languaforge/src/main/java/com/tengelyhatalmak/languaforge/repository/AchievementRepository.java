package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Integer> {


    @Query("SELECT a FROM Achievement a WHERE a.isDeleted = false")
    List<Achievement> findAllByIsDeletedFalse();
}
