package com.tengelyhatalmak.languaforge.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tengelyhatalmak.languaforge.repository.LessonRepository;
import jakarta.persistence.*;
import jdk.jfr.Percentage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgress {




    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @JsonIgnoreProperties({"leaderboardList", "scores", "lessonProgresses", "reviews", "loginDataList", "streak","role"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_id", nullable = false, insertable = false, updatable = false)
    private Integer userId;

    @Column(name = "lesson_id", nullable = false)
    private Integer lessonId;

    @Column(name = "exercise_count", nullable = false)
    private Integer exerciseCount;

    @Column(name = "completed_exercises", nullable = false)
    private Integer completedExercises;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "completed_at")
    private Timestamp completedAt;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt = Timestamp.valueOf(LocalDateTime.now());

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


     public Boolean isLessonCompleted(){
        return this.completedExercises.equals(this.exerciseCount);
    }



    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());
        }
        if (isDeleted == null) {
            isDeleted = false;
        }
    }


}
