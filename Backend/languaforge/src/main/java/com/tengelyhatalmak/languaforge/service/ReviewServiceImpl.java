package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Review;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.ReviewRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService{

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public List<Review> findAllReviewsByUserId(Integer userId) {
        return reviewRepository.findAllReviewsByUserId(userId);
    }

    @Override
    public Integer countReviewsByUserId(Integer userId) {
         User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return reviewRepository.countReviewsByUser(user);
    }

    @Override
    public Float averageRatingByCourseId(Integer courseId) {
        return reviewRepository.averageRatingByCourse(courseId);
    }

    @Override
    public List<Review> findAllReviewsByCourseId(Integer courseId) {
        return reviewRepository.findAllReviewsByCourseId(courseId);
    }

    @Override
    public Review findReviewById(Integer id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    @Override
    public Review updateReview(Review review, Integer id) {
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        existingReview.setRating(review.getRating());
        existingReview.setComment(review.getComment());

        return reviewRepository.save(existingReview);
    }

    @Override
    public Review softDeleteReview(Integer id) {
        Review reviewToSoftDelete = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        reviewToSoftDelete.setIsDeleted(true);

        return reviewRepository.save(reviewToSoftDelete);
    }

    @Override
    public void deleteReviewById(Integer id) {
        System.out.println("Deleting review with id: "+id);

        reviewRepository.deleteById(id);
    }
}
