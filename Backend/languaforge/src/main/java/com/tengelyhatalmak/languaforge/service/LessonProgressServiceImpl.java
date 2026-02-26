package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.domainevent.LessonCompletedDE;
import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.LessonProgress;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXCourse;
import com.tengelyhatalmak.languaforge.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LessonProgressServiceImpl implements LessonProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final UserXCourseRepository userXCourseRepository;
    private final ApplicationEventPublisher eventPublisher;

    public LessonProgressServiceImpl(
            LessonProgressRepository lessonProgressRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository,
            UserXCourseRepository userXCourseRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.userXCourseRepository = userXCourseRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public LessonProgress saveLessonProgress(LessonProgress lessonProgress) {

        Lesson lesson = lessonRepository.findById(lessonProgress.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonProgress.getLessonId()));

        lessonProgress.setExerciseCount(lesson.getExercises().size());

        User user = userRepository.findById(lessonProgress.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + lessonProgress.getUserId()));

        lessonProgress.setUser(user);

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

        LessonProgress existing = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        boolean wasCompletedBefore = existing.getCompletedAt() != null;

        existing.setCompletedExercises(lessonProgress.getCompletedExercises());
        existing.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        boolean isNowCompleted =
                existing.getCompletedExercises() >= existing.getExerciseCount();



        System.out.println("=========wasCompletedBefore: " + wasCompletedBefore+"=========");
        System.out.println("=========completedExercises: " + existing.getCompletedExercises()+"=========");
        System.out.println("=========exerciseCount: " + existing.getExerciseCount()+"=========");
        System.out.println("===========isNowCompleted: " + isNowCompleted+"=========");
        if (isNowCompleted && !wasCompletedBefore) {

            existing.setCompletedAt(Timestamp.valueOf(LocalDateTime.now()));

            // 🔥 Publish event ONLY when transitioning to completed
            eventPublisher.publishEvent(
                    new LessonCompletedDE(
                            this,
                            existing.getUserId(),
                            existing.getLessonId()
                    )
            );
        }

        LessonProgress saved = lessonProgressRepository.save(existing);

        updateCourseProgress(existing);

        return saved;
    }

    private void updateCourseProgress(LessonProgress lessonProgress) {
        try {
            Integer userId = lessonProgress.getUserId();

            Lesson lesson = lessonRepository.findById(lessonProgress.getLessonId())
                    .orElseThrow(() -> new RuntimeException("Lesson not found"));

            Integer courseId = lesson.getUnit().getCourseId();

            List<Integer> courseLessonIds = lessonRepository.findLessonIdsByCourseId(courseId);

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

            Double progress = totalLessons > 0
                    ? (double) completedLessons / totalLessons
                    : 0.0;

            UserXCourse userXCourse =
                    userXCourseRepository.findUserXCoursesByUserIdAndCourseId(userId, courseId);

            if (userXCourse != null) {
                userXCourse.setProgress(progress);
                userXCourseRepository.save(userXCourse);
            }

        } catch (Exception e) {
            System.err.println("Error updating course progress: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public Boolean isLessonCompleted(Integer id) {
        LessonProgress lessonProgress = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        return lessonProgress.getCompletedAt() != null;
    }

    @Override
    public LessonProgress softDeleteLessonProgress(Integer id) {
        LessonProgress lessonProgress = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        lessonProgress.setIsDeleted(true);
        lessonProgress.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return lessonProgressRepository.save(lessonProgress);
    }

    @Override
    public void deleteLessonProgress(Integer id) {
        lessonProgressRepository.deleteById(id);
    }
}