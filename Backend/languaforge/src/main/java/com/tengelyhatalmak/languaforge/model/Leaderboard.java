package com.tengelyhatalmak.languaforge.model;

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
@Table(name = "leaderboard")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Leaderboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;


    @JsonIgnoreProperties({"leaderboardList", "scores", "reviews", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak","role"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="user_id", nullable = false, insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id", nullable = false)
    private Integer userId;


    @JsonIgnoreProperties({"leaderboards", "userXCourses", "lessons", "reviews", "units"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="course_id", nullable = false, insertable = false, updatable = false)
    private Course course;




    @Column(name = "course_id", nullable = false)
    private Integer courseId;

    @Column(name = "points")
    private Integer points;

    @Column(name = "updated_at")
    private Timestamp updatedAt;


    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;


    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    @PrePersist
    protected void onCreate() {
        if (isDeleted == null){
            isDeleted = false;
            deletedAt = null;
        } else {
            isDeleted = true;
            deletedAt = Timestamp.valueOf(LocalDateTime.now());
        }



    }



}
