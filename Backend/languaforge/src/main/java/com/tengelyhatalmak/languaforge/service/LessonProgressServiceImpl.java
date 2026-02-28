package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.domainevent.LessonCompletedDE;
import com.tengelyhatalmak.languaforge.model.*;
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
    private final StreakService streakService;

    public LessonProgressServiceImpl(
            LessonProgressRepository lessonProgressRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository,
            UserXCourseRepository userXCourseRepository,
            ApplicationEventPublisher eventPublisher,
            StreakService streakService
    ) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.userXCourseRepository = userXCourseRepository;
        this.eventPublisher = eventPublisher;
        this.streakService = streakService;
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
    public Integer findCompletedLessonProgressCountOverall() {
        return lessonProgressRepository.findCompletedCountOverall();
    }

    @Override
    public Boolean userByIdHasLessonCompletedToday(Integer userId) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Timestamp startOfDay = Timestamp.valueOf(LocalDateTime.now().toLocalDate().atStartOfDay());
        Timestamp endOfDay = Timestamp.valueOf(LocalDateTime.now().toLocalDate().atTime(23, 59, 59));
        System.out.println(("=========Checking hasCompletedToday for user "+userId+": "+
                lessonProgressRepository.existsAnyCompletionToday(userId, startOfDay, endOfDay)+" at "+
                LocalDateTime.now()));
        return lessonProgressRepository.existsAnyCompletionToday(userId, startOfDay, endOfDay);
    }


    @Override
    @Transactional
    public LessonProgress updateLessonProgress(LessonProgress lessonProgress, Integer id) {
        LessonProgress existing = lessonProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LessonProgress not found"));

        boolean wasCompletedBefore = existing.getCompletedAt() != null;

        existing.setCompletedExercises(lessonProgress.getCompletedExercises());
        existing.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        boolean isNowCompleted = existing.getCompletedExercises() >= existing.getExerciseCount();

        System.out.println("=========wasCompletedBefore: " + wasCompletedBefore + "=========");
        System.out.println("=========completedExercises: " + existing.getCompletedExercises() + "=========");
        System.out.println("=========exerciseCount: " + existing.getExerciseCount() + "=========");
        System.out.println("===========isNowCompleted: " + isNowCompleted + "=========");

        boolean alreadyHadActivityToday = false;
        if (isNowCompleted && !wasCompletedBefore) {
            Timestamp startOfDay = Timestamp.valueOf(LocalDateTime.now().toLocalDate().atStartOfDay());
            Timestamp endOfDay = Timestamp.valueOf(LocalDateTime.now().toLocalDate().atTime(23, 59, 59, 999_999_999));

            alreadyHadActivityToday = lessonProgressRepository.existsAnyCompletionToday(
                    existing.getUserId(), startOfDay, endOfDay);

            System.out.println("=========PRE-SAVE check hasCompletedToday for user " + existing.getUserId() +
                    ": " + alreadyHadActivityToday + " at " + LocalDateTime.now());
        }

        if (isNowCompleted && !wasCompletedBefore) {
            existing.setCompletedAt(Timestamp.valueOf(LocalDateTime.now()));
        }

        LessonProgress saved = lessonProgressRepository.save(existing);

        if (isNowCompleted && !wasCompletedBefore) {
            eventPublisher.publishEvent(
                    new LessonCompletedDE(this, existing.getUserId(), existing.getLessonId())
            );
        }

        if (isNowCompleted && !wasCompletedBefore && !alreadyHadActivityToday) {
            System.out.println("FIRST daily completion detected → incrementing streak for user " + existing.getUserId());
            streakService.incrementOrCreateStreak(existing.getUserId());
        }

        updateCourseProgress(saved);

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