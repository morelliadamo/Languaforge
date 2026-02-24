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
@Table(name = "user_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserXItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "courses", "scores", "achievementsOfUser", "userXCourses", "loginDataList", "lessonProgresses", "streak", "leaderboardList"})
    private User user;

    @Column(name = "user_id", nullable = false, insertable = false, updatable = false)
    private Integer userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private StoreItem storeItem;

    @Column(name = "item_id", nullable = false, insertable = false, updatable = false)
    private Integer itemId;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Timestamp.valueOf(LocalDateTime.now());
    }
}