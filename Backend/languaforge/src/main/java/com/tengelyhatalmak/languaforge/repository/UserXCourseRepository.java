package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Course;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXCourse;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserXCourseRepository extends JpaRepository<UserXCourse, Integer> {

    @Procedure("get_user_course_by_username")
    List<UserXCourse> getUserXCourseByUsername(String username);

    @Query("SELECT uc.user FROM UserXCourse uc WHERE uc.course.id = :courseId")
    List<User> getUsersByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT uc.course FROM UserXCourse uc WHERE uc.user.id = :userId")
    List<Course> getCoursesByUserId(@Param("userId") Integer userId);
}
