package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Integer> {
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.id = :userId")
    public List<LessonProgress> findByUserId(@Param("userId")Integer userId);


    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.completedExercises = lp.exerciseCount")
    List<LessonProgress> findCompletedByUserId(@Param("userId") Integer userId);

}
