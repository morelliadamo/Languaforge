package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.Unit;

import java.util.List;

public interface CourseService {
    Course saveCourse(Course course);
    List<Course> findAllCourses();
    List<Unit> findAllUnitsByCourseId(Integer courseId);
    Course findCourseById(Integer id);
    Course updateCourse(Course course, Integer id);
    void deleteCourseById(Integer id);

}
