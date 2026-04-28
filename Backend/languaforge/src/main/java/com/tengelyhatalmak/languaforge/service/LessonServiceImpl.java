package com.tengelyhatalmak.languaforge.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.repository.LessonRepository;

@Service
public class LessonServiceImpl implements LessonService {


    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    @Override
    public List<Lesson> findAllLessons() {
        return lessonRepository.findAll();
    }

    @Override
    public Lesson findLessonById(Integer id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    @Override
    public Lesson updateLesson(Lesson lesson, Integer id) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        existingLesson.setTitle(lesson.getTitle());
        existingLesson.setOrderIndex(lesson.getOrderIndex());

        return lessonRepository.save(existingLesson);
    }

    @Override
    public Lesson softDeleteLesson(Integer id) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        existingLesson.setIsDeleted(true);
        existingLesson.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        existingLesson.getExercises().forEach(exercise -> {
            exercise.setIsDeleted(true);
            exercise.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
        });



        return lessonRepository.save(existingLesson);
    }

    @Override
    public Lesson restoreLesson(Integer id) {
        Lesson lessonToRestore =  lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lessonToRestore.setIsDeleted(false);
        lessonToRestore.setDeletedAt(null);

        lessonToRestore.getExercises().forEach(exercise -> {
            exercise.setIsDeleted(false);
            exercise.setDeletedAt(null);
        });

        return lessonRepository.save(lessonToRestore);

    }

    @Override
    public void deleteLessonById(Integer id) {
        System.out.println("Deleting lesson with id: " + id);
        lessonRepository.deleteById(id);
    }
}
