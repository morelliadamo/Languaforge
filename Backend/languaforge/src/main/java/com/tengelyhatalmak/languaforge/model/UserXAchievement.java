package com.tengelyhatalmak.languaforge.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_achievement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserXAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="user_id", nullable = false, insertable = false, updatable = false)
    @JsonIgnoreProperties("achievementsOfUser, userXCourses, scores, reviews, leaderboardList, loginDataList, streak, lessonProgress, courses, role, reviews")
    @JsonIgnore
    private User user;

    @Column(name = "user_id", nullable = false)
    @JsonIgnoreProperties("achievementsOfUser, userXCourses, scores, reviews, leaderboardList, loginDataList, streak, lessonProgress")
    private Integer userId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="achievement_id", nullable = false, insertable = false, updatable = false)
    @JsonIgnoreProperties("usersOfAchievement")
    private Achievement achievement;

    @Column(name = "achievement_id", nullable = false)
    private Integer achievementId;

    @Column(name = "earned_at", nullable = false)
    private Timestamp earnedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    @PrePersist
    public void prePersist() {
        if (earnedAt == null) {
            earnedAt = Timestamp.valueOf(LocalDateTime.now());
        }
         if (isDeleted == null) {
            isDeleted = false;
            deletedAt = null;
        }
    }

}
