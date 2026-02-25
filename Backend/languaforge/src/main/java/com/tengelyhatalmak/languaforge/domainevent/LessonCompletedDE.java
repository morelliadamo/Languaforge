package com.tengelyhatalmak.languaforge.domainevent;

import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class LessonCompletedDE extends ApplicationEvent {
    private Integer userId;
    private Integer lessonId;
    private Timestamp completedAt;


    public LessonCompletedDE(Object source, Integer userId, Integer lessonId) {
        super(source);
        this.userId = userId;
        this.lessonId = lessonId;
        this.completedAt = Timestamp.valueOf(LocalDateTime.now());
    }

}
