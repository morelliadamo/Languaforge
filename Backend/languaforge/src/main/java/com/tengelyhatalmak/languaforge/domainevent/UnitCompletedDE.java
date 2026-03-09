package com.tengelyhatalmak.languaforge.domainevent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class UnitCompletedDE  extends ApplicationEvent {
    private Integer userId;
    private Integer unitId;
    private Timestamp completedAt;

    public UnitCompletedDE(Object source, Integer userId, Integer unitId) {
        super(source);
        this.userId = userId;
        this.unitId = unitId;
        this.completedAt = Timestamp.valueOf(LocalDateTime.now());
    }
}
