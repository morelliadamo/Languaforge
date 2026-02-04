package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.Review;
import com.tengelyhatalmak.languaforge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    public List<Review> findAllReviewsByUserId(Integer userId);

    @Query("SELECT r FROM Review r WHERE r.course.id = :courseId")
    public List<Review> findAllReviewsByCourseId(Integer courseId);

    Integer countReviewsByUser(User user);
    Integer countReviewsByCourse(Course course);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId")
    Float averageRatingByCourse(Integer courseId);

}
