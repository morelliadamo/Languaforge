package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.*;
import com.tengelyhatalmak.languaforge.repository.UserXCourseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserXCourseServiceImpl implements UserXCourseService{

    @Autowired
    private UserXCourseRepository userXCourseRepository;

    @Override
    public UserXCourse saveUserXCourse(UserXCourse userXCourse) {
        return userXCourseRepository.save(userXCourse);
    }

    @Override
    public List<UserXCourse> findAllUserXCourses() {
        return userXCourseRepository.findAll();
    }

    @Override
    public UserXCourse findUserXCourseById(Integer id) {
        return userXCourseRepository.findById(id).orElseThrow(() -> new RuntimeException("UserXCourse not found"));
    }

    @Override
    @Transactional
    public List<UserXCourse> findUserXCourseByUsername(String username) {
        return userXCourseRepository.getUserXCourseByUsername(username);
    }

    @Override
    @Transactional
    public List<Unit> findUnitsByUsernameAndCourseId(String username, Integer courseId) {
        return userXCourseRepository.findUnitsByUsernameAndCourseId(username, courseId);
    }

    @Override
    @Transactional
    public Unit findUnitByUsernameAndCourseIdAndUnitId(String username, Integer courseId, Integer unitId) {
        return userXCourseRepository.findUnitByUsernameAndCourseIdAndUnitId(username, courseId, unitId);
    }

    @Override
    public List<User> findUsersByCourseId(Integer courseId) {
        return userXCourseRepository.getUsersByCourseId(courseId);
    }

    @Override
    public List<Course> findCoursesByUserId(Integer userId) {
        return userXCourseRepository.getCoursesByUserId(userId);
    }

    @Override
    public List<UserXCourse> findUserXCoursesByUserId(Integer userId) {
        return userXCourseRepository.findUserXCourseByUserId(userId);
    }

    @Override
    public UserXCourse findUserXCourseByUserIdAndCourseId(Integer userId, Integer courseId) {
        return userXCourseRepository.findUserXCoursesByUserIdAndCourseId(userId, courseId);
    }

    @Override
    public UserXCourse updateUserXCourse(UserXCourse userXCourse, Integer id) {
        UserXCourse existingUserXCourse = userXCourseRepository.findById(id).orElseThrow(() -> new RuntimeException("UserXCourse not found"));
        existingUserXCourse.setUser(userXCourse.getUser());
        existingUserXCourse.setCourse(userXCourse.getCourse());
        existingUserXCourse.setProgress(userXCourse.getProgress());

        return userXCourseRepository.save(existingUserXCourse);
    }

    @Override
    public void deleteUserXCourseById(Integer id) {
        System.out.println("Deleting UserXCourse with id: " + id);
        userXCourseRepository.deleteById(id);
    }
}
