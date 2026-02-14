package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Exercise;

import java.util.List;

public interface ExerciseService {
    Exercise saveExercise(Exercise exercise);

    List<Exercise> findAllExercises();
//TODO    List<Exercise> findAllExercisesByLessonId(Integer lessonId);

    Exercise findExerciseById(Integer id);
    Exercise updateExercise(Exercise exercise, Integer id);

    Exercise softDeleteExerciseById(Integer id);
    Exercise restoreExerciseById(Integer id);

    void deleteExerciseById(Integer id);

}
