package com.tengelyhatalmak.languaforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class AchievementUnlockedDTO {
    private Integer achievementId;
    private String achievementName;
    private String achievementDescription;
    private String achievementIconUrl;
    private Timestamp earnedAt;
}

