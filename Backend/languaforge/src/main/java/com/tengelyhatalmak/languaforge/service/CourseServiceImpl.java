package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.model.Lesson;
import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.repository.CourseRepository;
import com.tengelyhatalmak.languaforge.repository.LessonRepository;
import com.tengelyhatalmak.languaforge.repository.UnitRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseServiceImpl implements CourseService{

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private LessonRepository lessonRepository;

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
    public Course updateCourse(Course course, Integer id) {
        Course existingCourse = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        existingCourse.setTitle(course.getTitle());
        existingCourse.setDescription(course.getDescription());
        existingCourse.setIsDeleted(course.getIsDeleted());
        return courseRepository.save(existingCourse);
    }





    @Override
    public void deleteCourseById(Integer id) {
        System.out.println("Deleting course with id: " + id);
        courseRepository.deleteById(id);
    }
}
