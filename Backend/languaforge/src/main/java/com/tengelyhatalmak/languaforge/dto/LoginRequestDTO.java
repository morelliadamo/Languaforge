package com.tengelyhatalmak.languaforge.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String identifier;
    private String password;
}
