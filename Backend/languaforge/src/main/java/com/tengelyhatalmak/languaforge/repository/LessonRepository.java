package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    @Query("SELECT l.id FROM Lesson l WHERE l.unit.courseId = :courseId AND l.isDeleted = false")
    List<Integer> findLessonIdsByCourseId(@Param("courseId") Integer courseId);
}
