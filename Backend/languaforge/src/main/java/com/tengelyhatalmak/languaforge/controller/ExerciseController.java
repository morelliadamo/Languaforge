package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping("/")
    public List<Exercise> getAllExercises() {
        return exerciseService.findAllExercises();
    }

    @GetMapping("/{id}")
    public Exercise getExerciseById(@PathVariable Integer id) {
        return exerciseService.findExerciseById(id);
    }


    @PostMapping("/createExercise")
    public Exercise createExercise(@RequestBody Exercise exercise) {
        return exerciseService.saveExercise(exercise);
    }

    @PutMapping("/updateExercise/{id}")
    public Exercise updateExercise(@RequestBody Exercise exercise, @PathVariable Integer id) {
        return exerciseService.updateExercise(exercise, id);
    }

    @PatchMapping("/softDeleteExercise/{id}")
    public Exercise softDeleteExercise(@PathVariable Integer id){
        return exerciseService.softDeleteExerciseById(id);
    }

    @PatchMapping("/restoreExercise/{id}")
    public Exercise restoreExercise(@PathVariable Integer id){
        return exerciseService.restoreExerciseById(id);
    }

    @DeleteMapping("/hardDeleteExercise/{id}")
    public String hardDeleteExercise(@PathVariable Integer id) {
        exerciseService.deleteExerciseById(id);
        return "Exercise with id " + id + " has been deleted";
    }
}
