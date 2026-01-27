package com.tengelyhatalmak.languaforge.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Table(name = "user_achievement")
@Getter
@Setter
@NoArgsConstructor
public class UserXAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="user_id", nullable = false, insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id", nullable = false)
    private Integer userId;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="achievement_id", nullable = false, insertable = false, updatable = false)
    private Achievement achievement;

    @Column(name = "achievement_id", nullable = false)
    private Integer achievementId;

    @Column(name = "earned_at", nullable = false)
    private Timestamp earnedAt;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;
}
