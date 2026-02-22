package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.*;
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


    @Query("SELECT u FROM Unit u WHERE u.course.id = :courseId AND " +
            "EXISTS (SELECT uxc FROM UserXCourse uxc WHERE uxc.user.username = :username " +
            "AND uxc.course.id = :courseId)")
    List<Unit> findUnitsByUsernameAndCourseId(@Param("username")String username, @Param("courseId")Integer courseId);


    @Query("SELECT u FROM Unit u WHERE u.id = :unitId AND u.course.id = :courseId AND " +
            "EXISTS (SELECT uxc FROM UserXCourse uxc WHERE uxc.user.username = :username " +
            "AND uxc.course.id = :courseId)")
    Unit findUnitByUsernameAndCourseIdAndUnitId(@Param("username") String username,
                                                  @Param("courseId") Integer courseId,
                                                  @Param("unitId") Integer unitId);

    List<UserXCourse> findUserXCourseByUserId(Integer userId);


    @Query("SELECT uc FROM UserXCourse uc WHERE uc.user.id = :userId AND uc.course.id = :courseId")
    UserXCourse findUserXCoursesByUserIdAndCourseId(@Param("userId") Integer userId, @Param("courseId") Integer courseId);
}
