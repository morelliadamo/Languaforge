package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXCourse;

import java.util.List;

public interface UserXCourseService {
    UserXCourse saveUserXCourse(UserXCourse userXCourse);
    List<UserXCourse> findAllUserXCourses();
    UserXCourse findUserXCourseById(Integer id);
    List<UserXCourse> findUserXCourseByUsername(String username);

    List<User> findUsersByCourseId(Integer courseId);
    List<Course> findCoursesByUserId(Integer userId);

    UserXCourse updateUserXCourse(UserXCourse userXCourse, Integer id);
    void deleteUserXCourseById(Integer id);
}
