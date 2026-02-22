package com.tengelyhatalmak.languaforge.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_course")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserXCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "courses", "scores", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak", "leaderboardList"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "leaderboardList", "userXCourses", "scores", "reviews"})
    private Course course;

    @Column(name = "enrolled_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp enrolledAt;

    @Column(name = "progress", columnDefinition = "DECIMAL(5,2) DEFAULT 0.00")
    private Double progress = 0.0;

    @Column(name = "completed_at")
    private Timestamp completedAt;


    public UserXCourse(User user, Course course) {
        this.user = user;
        this.course = course;
    }
}
