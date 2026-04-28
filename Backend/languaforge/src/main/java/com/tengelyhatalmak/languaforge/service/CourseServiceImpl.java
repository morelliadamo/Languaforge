package com.tengelyhatalmak.languaforge.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.Review;
import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.repository.CourseRepository;
import com.tengelyhatalmak.languaforge.repository.ExerciseRepository;
import com.tengelyhatalmak.languaforge.repository.LessonRepository;
import com.tengelyhatalmak.languaforge.repository.UnitRepository;
import com.tengelyhatalmak.languaforge.repository.UserXCourseRepository;

import jakarta.transaction.Transactional;

@Service
public class CourseServiceImpl implements CourseService{

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private LessonRepository lessonRepository;


    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private UserXCourseRepository userXCourseRepository;

    @Override
    @Transactional
    public Course saveCourse(Course course) {
        course.setId(null);
        course.setReviews(new ArrayList<>());
        course.setUsersXCourse(new ArrayList<>());
        course.setLeaderboardList(new ArrayList<>());


        List<Unit> incomingUnits = course.getUnits() != null ? new ArrayList<>(course.getUnits()) : new ArrayList<>();
        course.getUnits().clear();

        Course savedCourse = courseRepository.saveAndFlush(course);

        for (Unit unit : incomingUnits) {
            unit.setId(null);
            unit.setCourseId(savedCourse.getId());

            List<Lesson> incomingLessons = unit.getLessons() != null ? new ArrayList<>(unit.getLessons()) : new ArrayList<>();
            unit.getLessons().clear();

            Unit savedUnit = unitRepository.saveAndFlush(unit);

            for (Lesson lesson : incomingLessons) {
                lesson.setId(null);
                lesson.setUnitId(savedUnit.getId());

                List<Exercise> incomingExercises = lesson.getExercises() != null ? new ArrayList<>(lesson.getExercises()) : new ArrayList<>();
                lesson.getExercises().clear();

                Lesson savedLesson = lessonRepository.saveAndFlush(lesson);

                for (Exercise exercise : incomingExercises) {
                    exercise.setId(null);
                    exercise.setLessonId(savedLesson.getId());
                }
                savedLesson.getExercises().addAll(incomingExercises);
                lessonRepository.saveAndFlush(savedLesson);

                savedUnit.getLessons().add(savedLesson);
            }

            savedCourse.getUnits().add(savedUnit);
        }

        return savedCourse;
    }


    @Override
    public List<Course> findAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public List<Unit> findAllUnitsByCourseId(Integer courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"))
                .getUnits();
    }

    @Override
    public Course findCourseById(Integer id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public Course findCourseByMostUsers() {
        Course courseWithMostUsers = null;
        int maxUsers = -1;

        for (Course course : courseRepository.findAll()) {
            int userCount = userXCourseRepository.countByCourseId((course.getId()));
            if (userCount > maxUsers) {
                maxUsers = userCount;
                courseWithMostUsers = course;
            }
        }

        System.out.println("Course with most users: " + (courseWithMostUsers != null ? courseWithMostUsers.getTitle() : "None") + " with " + maxUsers + " users.");
        return courseWithMostUsers;
    }

    @Override
    public Course findCourseByBestReviews() {
        Course courseWithBestReviews = null;
        double highestAverageRating = -1.0;

        for (Course course : courseRepository.findAll()) {
            double averageRating = course.getReviews().stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            if (averageRating > highestAverageRating) {
                highestAverageRating = averageRating;
                courseWithBestReviews = course;
            }
        }
        System.out.println("Course with best reviews: " + (courseWithBestReviews != null ? courseWithBestReviews.getTitle() : "None") + " with average rating of " + highestAverageRating);
        return courseWithBestReviews;
    }

    @Override
    public Course softDeleteCourse(Integer id) {

        Course courseToSoftDelete = courseRepository.findById(id)
                    .orElseThrow(()->new RuntimeException("Course not found"));

            courseToSoftDelete.setIsDeleted(true);
            courseToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));




            unitRepository.findAll().stream()
                    .filter(unit -> unit.getCourse().getId().equals(id))
                    .forEach(unit -> {
                        unit.setIsDeleted(true);
                        unit.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
                        unitRepository.save(unit);

                        lessonRepository.findAll().stream()
                                .filter(lesson -> lesson.getUnit().getId().equals(unit.getId()))
                                .forEach(lesson -> {
                                    lesson.setIsDeleted(true);
                                    lesson.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
                                    lessonRepository.save(lesson);

                                    exerciseRepository.findAll().stream()
                                            .filter(exercise -> exercise.getLesson().getId().equals(lesson.getId()))
                                            .forEach(exercise -> {
                                                exercise.setIsDeleted(true);
                                                exercise.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
                                                exerciseRepository.save(exercise);
                                            });
                                });
                    });

            return courseRepository.save(courseToSoftDelete);




    }

    @Override
    public Course restoreCourse(Integer id) {
            Course courseToRestore = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            courseToRestore.setIsDeleted(false);
            courseToRestore.setDeletedAt(null);


            unitRepository.findAll().stream()
                    .filter(unit -> unit.getCourse().getId().equals(id))
                    .forEach(unit -> {
                        unit.setIsDeleted(false);
                        unit.setDeletedAt(null);
                        unitRepository.save(unit);

                        lessonRepository.findAll().stream()
                                .filter(lesson -> lesson.getUnit().getId().equals(unit.getId()))
                                .forEach(lesson -> {
                                    lesson.setIsDeleted(false);
                                    lesson.setDeletedAt(null);
                                    lessonRepository.save(lesson);

                                    exerciseRepository.findAll().stream()
                                            .filter(exercise -> exercise.getLesson().getId().equals(lesson.getId()))
                                            .forEach(exercise -> {
                                                exercise.setIsDeleted(false);
                                                exercise.setDeletedAt(null);
                                                exerciseRepository.save(exercise);
                                            });
                                });
                    });


            return courseRepository.save(courseToRestore);
        }

    @Override
    public Course updateCourse(Course course, Integer id) {
        Course existingCourse = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        if(course.getTitle() != null){
            existingCourse.setTitle(course.getTitle());
        } else{
            existingCourse.setTitle(existingCourse.getTitle());
        }

        if(course.getDescription() != null){
            existingCourse.setDescription(course.getDescription());
        } else {
            existingCourse.setDescription(existingCourse.getDescription());
        }

        if(course.getIsDeleted() != null){
            existingCourse.setIsDeleted(course.getIsDeleted());
            if (existingCourse.getIsDeleted()) {
                existingCourse.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
            } else {
                existingCourse.setDeletedAt(null);
            }
        } else {
            existingCourse.setIsDeleted(existingCourse.getIsDeleted());
        }

        return courseRepository.save(existingCourse);
    }





    @Override
    public void deleteCourseById(Integer id) {
        System.out.println("Deleting course with id: " + id);
        courseRepository.deleteById(id);
    }
}
