package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.LessonProgress;
import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Integer> {
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.id = :userId")
    public List<LessonProgress> findByUserId(@Param("userId")Integer userId);


    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.completedExercises = lp.exerciseCount")
    List<LessonProgress> findCompletedByUserId(@Param("userId") Integer userId);

    LessonProgress findByUserIdAndLessonId(Integer userId, Integer lessonId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.completedExercises = lp.exerciseCount AND lp.isDeleted = false")
    Integer findCompletedCountByUserId(Integer userId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.exerciseCount = lp.completedExercises AND lp.isDeleted = false")
    Integer findCompletedCountOverall();

    @Query("SELECT CASE WHEN (COUNT(lp) > 0) THEN true ELSE false END FROM LessonProgress lp WHERE lp.userId = :userId AND lp.completedAt >= :startOfDay AND lp.completedAt < :endOfDay")
    boolean existsAnyCompletionToday(@Param("userId") Integer userId, @Param("startOfDay") Timestamp startOfDay, @Param("endOfDay") Timestamp endOfDay
    );


    @Modifying
    @Query("""
    DELETE FROM LessonProgress lp
    WHERE lp.userId = :userId
    AND lp.lessonId IN (
        SELECT l.id
        FROM Lesson l
        WHERE l.unit.course.id = :courseId
    )
""")
    void deleteLessonProgressByUserIdAndCourseId(
            @Param("userId") Integer userId,
            @Param("courseId") Integer courseId
    );

}
