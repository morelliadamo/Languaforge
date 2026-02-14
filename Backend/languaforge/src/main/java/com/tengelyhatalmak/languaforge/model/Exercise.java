package com.tengelyhatalmak.languaforge.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false, insertable = false, updatable = false)
    @JsonBackReference
    private Lesson lesson;

    @Column(name = "lesson_id", nullable = false)
    private Integer lessonId;

    @Column(name = "exercise_content", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private ExerciseContent exerciseContent;

    @Column(name = "exercise_type", nullable = false)
    private String exerciseType;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;


    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = new Timestamp(Timestamp.valueOf(LocalDateTime.now()).getTime());
        }
        if (isDeleted == null) {
            isDeleted = false;
        }
    }
}
