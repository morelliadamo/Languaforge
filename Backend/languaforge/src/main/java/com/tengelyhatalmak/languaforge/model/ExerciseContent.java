package com.tengelyhatalmak.languaforge.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseContent {
    private List<String> answers;
    private String description;
    private String correctAnswer;
}