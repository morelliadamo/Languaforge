package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Review;
import com.tengelyhatalmak.languaforge.model.Role;
import com.tengelyhatalmak.languaforge.model.User;

import java.util.List;

public interface ReviewService {
    Review saveReview(Review review);
    List<Review> findAllReviews();
    List<Review> findAllReviewsByUserId(Integer userId);
    Integer countReviewsByUserId(Integer userId);
    Float averageRatingByCourseId(Integer courseId);


    List<Review> findAllReviewsByCourseId(Integer courseId);
    Review findReviewById(Integer id);
    Review updateReview(Review review, Integer id);
    Review softDeleteReview(Integer id);
    void deleteReviewById(Integer id);
}
