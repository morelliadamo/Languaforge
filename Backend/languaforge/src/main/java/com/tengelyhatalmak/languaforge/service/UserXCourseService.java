package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.*;

import java.util.List;

public interface UserXCourseService {
    UserXCourse saveUserXCourse(UserXCourse userXCourse);
    List<UserXCourse> findAllUserXCourses();
    UserXCourse findUserXCourseById(Integer id);
    List<UserXCourse> findUserXCourseByUsername(String username);
    List<Unit> findUnitsByUsernameAndCourseId(String username, Integer courseId);
    Unit findUnitByUsernameAndCourseIdAndUnitId(String username, Integer courseId, Integer unitId);

    List<User> findUsersByCourseId(Integer courseId);
    List<Course> findCoursesByUserId(Integer userId);
    List<UserXCourse> findUserXCoursesByUserId(Integer userId);
    UserXCourse findUserXCourseByUserIdAndCourseId(Integer userId, Integer courseId);

    UserXCourse updateUserXCourse(UserXCourse userXCourse, Integer id);
    void deleteUserXCourseById(Integer id);
}
