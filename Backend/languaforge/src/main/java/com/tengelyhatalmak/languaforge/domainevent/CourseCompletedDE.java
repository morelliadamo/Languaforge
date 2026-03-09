package com.tengelyhatalmak.languaforge.domainevent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class CourseCompletedDE extends ApplicationEvent {
    private Integer userId;
    private Integer courseId;
    private Timestamp completedAt;

    public CourseCompletedDE(Object source, Integer userId, Integer courseId) {
        super(source);
        this.userId = userId;
        this.courseId = courseId;
        this.completedAt = Timestamp.valueOf(LocalDateTime.now());
    }
}
