package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Review;
import com.tengelyhatalmak.languaforge.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;


    @GetMapping("/")
    public List<Review> getAllReviews() {
        return reviewService.findAllReviews();
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Integer id) {
        return reviewService.findReviewById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUserId(@PathVariable Integer userId) {
        return reviewService.findAllReviewsByUserId(userId);
    }

    @GetMapping("/course/{courseId}")
    public List<Review> getReviewsByCourseId(@PathVariable Integer courseId) {
        return reviewService.findAllReviewsByCourseId(courseId);
    }

    @GetMapping("/user/{userId}/count")
    public Integer countReviewsByUserId(@PathVariable Integer userId) {
        return reviewService.countReviewsByUserId(userId);
    }

    @GetMapping("/course/{courseId}/averageRating")
    public Float averageRatingByCourseId(@PathVariable Integer courseId) {
        return reviewService.averageRatingByCourseId(courseId);
    }

    @PostMapping("/createReview")
    public Review createReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    @PutMapping("/updateReview/{id}")
    public Review updateReview(@RequestBody Review review, @PathVariable Integer id) {
        return reviewService.updateReview(review, id);
    }

    @PatchMapping("/softDeleteReview/{id}")
    public Review softDeleteReview(@PathVariable Integer id) {
        return reviewService.softDeleteReview(id);
    }

    @DeleteMapping("/deleteReview/{id}")
    public void deleteReview(@PathVariable Integer id) {
        reviewService.deleteReviewById(id);
    }

}
