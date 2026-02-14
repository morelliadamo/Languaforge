package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExerciseServiceImpl implements ExerciseService{

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Override
    public Exercise saveExercise(Exercise exercise) {
        return exerciseRepository.save(exercise);
    }

    @Override
    public List<Exercise> findAllExercises() {
        return exerciseRepository.findAll();
    }

    @Override
    public Exercise findExerciseById(Integer id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }

    @Override
    public Exercise updateExercise(Exercise exercise, Integer id) {
        Exercise existingExercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        existingExercise.setExerciseContent(exercise.getExerciseContent());
        existingExercise.setExerciseType(exercise.getExerciseType());

        return exerciseRepository.save(existingExercise);
    }

    @Override
    public Exercise softDeleteExerciseById(Integer id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setIsDeleted(true);
        exercise.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return exerciseRepository.save(exercise);
    }

    @Override
    public Exercise restoreExerciseById(Integer id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        exercise.setIsDeleted(false);
        exercise.setDeletedAt(null);

        return exerciseRepository.save(exercise);
    }

    @Override
    public void deleteExerciseById(Integer id) {
        System.out.println("Deleting exercise with id: " + id);
        exerciseRepository.deleteById(id);
    }
}
