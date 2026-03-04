package com.tengelyhatalmak.languaforge.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserAsFriendSearchResultDTO {
    private Integer id;
    private String username;
    private String email;
    private String avatarUrl;
}
