package com.tengelyhatalmak.languaforge.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class AchievementUnlockedDTO {
    private Integer id;
    private String name;
    private String description;
    private String iconUrl;
    private Timestamp earnedAt;
}

