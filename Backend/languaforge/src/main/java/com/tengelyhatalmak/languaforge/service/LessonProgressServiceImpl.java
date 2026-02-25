package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.domainevent.LessonCompletedDE;
import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.LessonProgress;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXCourse;
import com.tengelyhatalmak.languaforge.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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

    @Autowired
    private UserXCourseRepository userXCourseRepository;

    private ApplicationEventPublisher eventPublisher;


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
    public List<LessonProgress> findLessonProgressesByUserIdAndCourseId(Integer userId, Integer courseId) {

    List<LessonProgress> userLessonProgresses = findLessonProgressesByUserId(userId);

        return userLessonProgresses.stream()
                .filter(lp -> {
                    Lesson lesson = lessonRepository.findById(lp.getLessonId())
                            .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lp.getLessonId()));
                    return lesson.getUnit().getCourseId().equals(courseId);
                })
                .toList();
    }

    @Override
    public List<LessonProgress> findCompletedLessonProgressesByUserId(Integer userId) {
        return lessonProgressRepository.findCompletedByUserId(userId);
    }

    @Override
    @Transactional
    public LessonProgress updateLessonProgress(LessonProgress lessonProgress, Integer id) {

        LessonProgress existingLessonProgress = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));


        existingLessonProgress.setCompletedExercises(lessonProgress.getCompletedExercises());
        existingLessonProgress.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        if (existingLessonProgress.getCompletedExercises() >= existingLessonProgress.getExerciseCount()) {
            existingLessonProgress.setCompletedAt(Timestamp.valueOf(LocalDateTime.now()));
        }

        publishIfNewlyCompleted(existingLessonProgress); // check if the lesson was just completed and publish event if so

        LessonProgress saved = lessonProgressRepository.save(existingLessonProgress);

        try {
            Integer userId = existingLessonProgress.getUserId();

            Lesson lesson = lessonRepository.findById(existingLessonProgress.getLessonId())
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));

            Integer courseId = lesson.getUnit().getCourseId();

            System.out.println("=== Course Progress Update ===");
            System.out.println("userId: " + userId);
            System.out.println("courseId: " + courseId);

            List<Integer> courseLessonIds = lessonRepository.findLessonIdsByCourseId(courseId);
            System.out.println("courseLessonIds: " + courseLessonIds);

            int totalLessons = courseLessonIds.size();
            int completedLessons = 0;

            List<LessonProgress> userProgresses = lessonProgressRepository.findByUserId(userId);

            for (Integer lessonId : courseLessonIds) {
                for (LessonProgress lp : userProgresses) {
                    if (lp.getLessonId().equals(lessonId)
                            && lp.getCompletedExercises() >= lp.getExerciseCount()) {
                        completedLessons++;
                        break;
                    }
                }
            }



            System.out.println("completedLessons: " + completedLessons);
            System.out.println("totalLessons: " + totalLessons);

            Double progress = totalLessons > 0 ? (double) completedLessons / totalLessons : 0.0;
            System.out.println("calculated progress: " + progress);

            UserXCourse userXCourse = userXCourseRepository.findUserXCoursesByUserIdAndCourseId(userId, courseId);
            System.out.println("userXCourse: " + userXCourse);

            if (userXCourse != null) {
                userXCourse.setProgress(progress);
                userXCourseRepository.save(userXCourse);
                System.out.println("Progress saved: " + progress);
            } else {
                System.err.println("No UserXCourse found for userId=" + userId + ", courseId=" + courseId);
            }
        } catch (Exception e) {
            System.err.println("Error updating course progress: " + e.getMessage());
            e.printStackTrace();
        }

        return saved;
    }
    private void publishIfNewlyCompleted(LessonProgress lessonProgress) {
        if (lessonProgress.getCompletedExercises() >= lessonProgress.getExerciseCount()
                && lessonProgress.getCompletedAt() == null)
            eventPublisher.publishEvent(
                    new LessonCompletedDE(this,
                            lessonProgress.getUserId(),
                            lessonProgress.getLessonId())
            );
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
