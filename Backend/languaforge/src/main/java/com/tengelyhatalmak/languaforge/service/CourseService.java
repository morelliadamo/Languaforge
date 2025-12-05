package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Course;

import java.util.List;

public interface CourseService {
    Course saveCourse(Course course);
    List<Course> findAllCourses();
    Course findCourseById(Integer id);
    Course updateCourse(Course course, Integer id);
    void deleteCourseById(Integer id);

}
