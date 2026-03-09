package com.tengelyhatalmak.languaforge.domainevent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class StreakAchievedDE extends ApplicationEvent {
    private Integer userId;
    private Integer streakLength;
    private Timestamp achievedAt;

    public StreakAchievedDE(Object source, Integer userId, Integer streakLength) {
        super(source);
        this.userId = userId;
        this.streakLength = streakLength;
        this.achievedAt = Timestamp.valueOf(LocalDateTime.now());
    }


}
