package com.tengelyhatalmak.languaforge.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseContent {
    private List<String> answers;
    private String description;
    private String correctAnswer;
    private List<List<String>> pairs;
}
