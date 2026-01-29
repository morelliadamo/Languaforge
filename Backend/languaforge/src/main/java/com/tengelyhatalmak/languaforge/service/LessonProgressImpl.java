package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.LessonProgress;
import com.tengelyhatalmak.languaforge.repository.LessonProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonProgressImpl implements LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;


    @Override
    public LessonProgress saveLessonProgress(LessonProgress lessonProgress) {
        return lessonProgressRepository.save(lessonProgress);
    }

    @Override
    public List<LessonProgress> findAllLessonProgresses() {
        return lessonProgressRepository.findAll();
    }

    @Override
    public LessonProgress findLessonProgressById(Integer id) {
        return lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));
    }

    @Override
    public List<LessonProgress> findLessonProgressesByUserId(Integer userId) {
        return lessonProgressRepository.findLessonProgressesByUserId(userId);
    }

    @Override
    public LessonProgress updateLessonProgress(LessonProgress lessonProgress, Integer id) {
        LessonProgress existingLessonProgress = lessonProgressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LessonProgress not found"));

        existingLessonProgress.setCompletedExercises(lessonProgress.getCompletedExercises());
        existingLessonProgress.setExerciseCount(lessonProgress.getExerciseCount());
        existingLessonProgress.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return lessonProgressRepository.save(existingLessonProgress);

    }

    @Override
    public Boolean isLessonCompleted(Integer id) {
        LessonProgress lessonProgressToCheck = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        return lessonProgressToCheck.isLessonCompleted();
    }

    @Override
    public LessonProgress softDeleteLessonProgress(Integer id) {
        LessonProgress lessonProgressToSoftDelete = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        lessonProgressToSoftDelete.setIsDeleted(true);
        lessonProgressToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return lessonProgressRepository.save(lessonProgressToSoftDelete);
    }

    @Override
    public void deleteLessonProgress(Integer id) {
        System.out.println("Deleting LessonProgress with id: "+id);
        lessonProgressRepository.deleteById(id);
    }
}
