package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.LessonProgress;

import java.util.List;

public interface LessonProgressService {
    LessonProgress saveLessonProgress(LessonProgress lessonProgress);

    List<LessonProgress> findAllLessonProgresses();
    LessonProgress findLessonProgressById(Integer id);
    List<LessonProgress> findLessonProgressesByUserId(Integer userId);
    List<LessonProgress> findCompletedLessonProgressesByUserId(Integer userId);


    LessonProgress updateLessonProgress(LessonProgress lessonProgress, Integer id);
    Boolean isLessonCompleted(Integer id);


    LessonProgress softDeleteLessonProgress(Integer id);
    void deleteLessonProgress(Integer id);

}
