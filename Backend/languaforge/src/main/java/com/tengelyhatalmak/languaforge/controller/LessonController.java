package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/")
    public List<Lesson> getAllLessons() {
        return lessonService.findAllLessons();
    }

    @GetMapping("/{id}")
    public Lesson getLessonById(@PathVariable Integer id) {
        return lessonService.findLessonById(id);
    }


    @PostMapping("/createLesson")
    public Lesson createLesson(@RequestBody Lesson lesson) {
        return lessonService.saveLesson(lesson);
    }

    @PutMapping("/updateLesson/{id}")
    public Lesson updateLesson(@RequestBody Lesson lesson, @PathVariable Integer id) {
        return lessonService.updateLesson(lesson, id);
    }

    @PatchMapping("/softDeleteLesson/{id}")
    public Lesson softDeleteLesson(@PathVariable Integer id){
        return lessonService.softDeleteLesson(id);
    }

    @PatchMapping("/restoreLesson/{id}")
    public Lesson restoreLesson(@PathVariable Integer id){
        return lessonService.restoreLesson(id);
    }

    @DeleteMapping("/hardDeleteLesson/{id}")
    public String hardDeleteLesson(@PathVariable Integer id) {
        lessonService.deleteLessonById(id);
        return "Lesson with id " + id + " has been deleted";
    }
}
