package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UnitRepository extends JpaRepository<Unit, Integer> {


    @Query("SELECT COUNT(DISTINCT u) FROM Unit u WHERE u.id NOT IN (SELECT l.unit.id FROM Lesson l WHERE l.id NOT IN" +
            " (SELECT lp.lessonId FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.completedExercises = lp.exerciseCount)) AND EXISTS (SELECT l FROM Lesson l WHERE l.unit.id = u.id)")
    Integer countCompletedUnitsByUserId(Integer userId);
}
