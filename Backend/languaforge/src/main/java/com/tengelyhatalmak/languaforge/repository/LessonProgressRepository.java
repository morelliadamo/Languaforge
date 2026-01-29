package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Integer> {
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.userId = :userId")
    public List<LessonProgress> findLessonProgressesByUserId(@Param("userId")Integer userId);

    @Query("SELECT lp FROM LessonProgress lp WHERE lp.userId = :userId AND lp.completedExercises = lp.exerciseCount")
    public List<LessonProgress> findCompletedLessonProgressesByUserId(@Param("userId")Integer userId);
}
