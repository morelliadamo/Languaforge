package com.tengelyhatalmak.languaforge.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import com.tengelyhatalmak.languaforge.service.UserService;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "courses", "scores", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak", "leaderboardList"})
    private User user;

    @Column(name = "user_id", nullable = false, insertable = false, updatable = false)
    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = true)
    @JsonIgnoreProperties({"reviews", "units", "leaderboardList", "userXCourses"})
    private Course course;

    @Column(name = "course_id", nullable = false, insertable = false, updatable = false)
    private Integer courseId;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", nullable = true)
    private String comment;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt = Timestamp.valueOf(LocalDateTime.now());


    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;



    @PrePersist
    protected void onCreate() {
        createdAt = Timestamp.valueOf(LocalDateTime.now());

        if(isDeleted == null) {
            isDeleted = false;
        }
    }


}
