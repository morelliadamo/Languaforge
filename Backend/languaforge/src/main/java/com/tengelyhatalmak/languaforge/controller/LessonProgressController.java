package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.LessonProgress;
import com.tengelyhatalmak.languaforge.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lessonprogresses")
public class LessonProgressController {

    @Autowired
    private LessonProgressService lessonProgressService;

    @GetMapping("/")
    public List<LessonProgress> getAllLessonProgresses(){
        return lessonProgressService.findAllLessonProgresses();
    }

    @GetMapping("/{id}")
    public LessonProgress getAllLessonProgresses(@PathVariable Integer id){
        return lessonProgressService.findLessonProgressById(id);
    }

    @GetMapping("/user/{userId}")
    public List<LessonProgress> getLessonProgressesByUserId(@PathVariable Integer userId){
        return lessonProgressService.findLessonProgressesByUserId(userId);
    }

    @GetMapping("/checkProgress/{id}")
    public Boolean checkProgress(@PathVariable Integer id){
        return lessonProgressService.isLessonCompleted(id);
    }


    @PostMapping("/createLessonProgress")
    public LessonProgress createLessonProgress(@RequestBody LessonProgress lessonProgress){
        return lessonProgressService.saveLessonProgress(lessonProgress);
    }

    @PutMapping("/updateLessonprogress/{id}")
    public LessonProgress updateLessonProgress(@RequestBody LessonProgress lessonProgress, @PathVariable Integer id){
        return lessonProgressService.updateLessonProgress(lessonProgress, id);
    }

    @PatchMapping("/softDeleteLessonProgress/{id}")
    public LessonProgress softDeleteLessonProgress(@PathVariable Integer id){
        return lessonProgressService.softDeleteLessonProgress(id);
    }

    @DeleteMapping("/hardDeleteLessonProgress/{id}")
    public void hardDeleteLessonProgress(@PathVariable Integer id){
        lessonProgressService.deleteLessonProgress(id);
    }
}
