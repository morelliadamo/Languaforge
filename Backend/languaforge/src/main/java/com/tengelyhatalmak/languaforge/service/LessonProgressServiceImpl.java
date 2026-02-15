package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.LessonProgress;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.LessonProgressRepository;
import com.tengelyhatalmak.languaforge.repository.LessonRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonProgressServiceImpl implements LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public LessonProgress saveLessonProgress(LessonProgress lessonProgress) {
//        ensuring lesson and user exist before saving the progress, and setting the exercise count for the lesson
        Lesson tempLesson= lessonRepository.findById(lessonProgress.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonProgress.getLessonId()));

        lessonProgress.setExerciseCount(tempLesson.getExercises().size());

        User tempUser = userRepository.findById(lessonProgress.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + lessonProgress.getUserId()));

        lessonProgress.setUser(tempUser);

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
        return lessonProgressRepository.findByUserId(userId);
    }

    @Override
    public List<LessonProgress> findCompletedLessonProgressesByUserId(Integer userId) {
        return lessonProgressRepository.findCompletedByUserId(userId);
    }

    @Override
    public LessonProgress updateLessonProgress(LessonProgress lessonProgress, Integer id) {

        Lesson tempLesson= lessonRepository.findById(lessonProgress.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonProgress.getLessonId()));

        lessonProgress.setExerciseCount(tempLesson.getExercises().size());

        User tempUser = userRepository.findById(lessonProgress.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + lessonProgress.getUserId()));

        lessonProgress.setUser(tempUser);


        LessonProgress existingLessonProgress = lessonProgressRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("LessonProgress not found"));

        existingLessonProgress.setCompletedExercises(lessonProgress.getCompletedExercises());
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
