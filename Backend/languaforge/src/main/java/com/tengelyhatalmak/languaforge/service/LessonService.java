package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.Unit;

import java.util.List;

public interface LessonService {
    Lesson saveLesson(Lesson lesson);
    List<Lesson> findAllLessons();
// TODO    List<Lesson> findAllExercisesByLessonId(Integer lessonId);
    Lesson findLessonById(Integer id);
    Lesson updateLesson(Lesson lesson, Integer id);
    void deleteLessonById(Integer id);
}
