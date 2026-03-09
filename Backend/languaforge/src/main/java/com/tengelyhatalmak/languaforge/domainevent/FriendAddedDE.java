package com.tengelyhatalmak.languaforge.domainevent;

import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
public class FriendAddedDE extends ApplicationEvent {
    private Integer userId;
    private Integer friendId;
    private Timestamp createdAt;

    public FriendAddedDE(Object source, Integer userId, Integer friendId) {
        super(source);
        this.userId = userId;
        this.friendId = friendId;
        this.createdAt = Timestamp.valueOf(LocalDateTime.now());
    }


}
