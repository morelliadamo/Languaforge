package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.service.CourseService;
import org.hibernate.annotations.CurrentTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping("/")
    public List<Course> getAllCourses() {
        return courseService.findAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Integer id) {
        return courseService.findCourseById(id);
    }

    @PostMapping("/createCourse")
    public Course createCourse(@RequestBody Course course) {
        course.setCreatedAt(Timestamp.valueOf(java.time.LocalDateTime.now()));
        return courseService.saveCourse(course);
    }

    @PutMapping("/updateCourse/{id}")
    public Course updateCourse(@RequestBody Course course, @PathVariable Integer id) {
        return courseService.updateCourse(course, id);
    }

    @PatchMapping("/softDeleteCourse/{id}")
    public Course softDeleteCourse(@PathVariable Integer id){
        Course course = courseService.findCourseById(id);
        course.setIsDeleted(true);
        return courseService.saveCourse(course);
    }
    @PatchMapping("/restoreCourse/{id}")
    public Course restoreCourse(@PathVariable Integer id) {
        Course course = courseService.findCourseById(id);
        course.setIsDeleted(false);
        return courseService.saveCourse(course);
    }

    @DeleteMapping("/hardDeleteCourse/{id}")
    public String hardDeleteCourse(@PathVariable Integer id) {
        courseService.deleteCourseById(id);
        return "Course with id " + id + " has been deleted.";
    }
}
