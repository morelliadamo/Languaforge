package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.*;
import com.tengelyhatalmak.languaforge.service.UserXCourseService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userXcourses")
public class UserXCourseController {

    @Autowired
    private UserXCourseService userXCourseService;

    @GetMapping("/")
    public List<UserXCourse> getAllUserXCourses() {
        return userXCourseService.findAllUserXCourses();
    }

    @GetMapping("/{id}")
    public UserXCourse getUserXCourseById(@PathVariable Integer id) {
        return userXCourseService.findUserXCourseById(id);
    }

    @GetMapping("/user/{username}")
    public List<UserXCourse> getUserXCourseByUsername(@PathVariable String username) {
        return userXCourseService.findUserXCourseByUsername(username);
    }

    @GetMapping("/course/{courseId}/users")
    public List<User> getUsersByCourseId(@PathVariable Integer courseId) {
        return userXCourseService.findUsersByCourseId(courseId);
    }

    @GetMapping("/user/{userId}/courses")
    public List<Course> getCoursesByUserId(@PathVariable Integer userId) {
        return userXCourseService.findCoursesByUserId(userId);
    }

    @GetMapping("/user/{username}/course/{courseId}")
    public List<Unit> getUnitsByUsernameAndCourseId(
            @PathVariable String username,
            @PathVariable Integer courseId) {
        return userXCourseService.findUnitsByUsernameAndCourseId(username, courseId);
    }

    @GetMapping("/user/{username}/course/{courseId}/unit/{unitId}")
    public Unit getUnitByUsernameAndCourseIdAndUnitId(
            @PathVariable String username,
            @PathVariable Integer courseId,
            @PathVariable Integer unitId) {
        return userXCourseService.findUnitByUsernameAndCourseIdAndUnitId(username, courseId, unitId);
    }



    @PostMapping("/enroll")
    public UserXCourse enrollUserInCourse(@RequestBody UserXCourse userXCourse) {
        return userXCourseService.saveUserXCourse(userXCourse);
    }

    @PutMapping("/update/{id}")
    public UserXCourse updateUserXCourse(@RequestBody UserXCourse userXCourse, @PathVariable Integer id) {
        return userXCourseService.updateUserXCourse(userXCourse, id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUserXCourse(@PathVariable Integer id) {
        userXCourseService.deleteUserXCourseById(id);
    }
}
