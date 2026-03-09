package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.naming.CompositeName;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    @Query("SELECT c FROM Course c WHERE c.isDeleted = false")
    List<Course> findAllByIsDeletedFalse();
}
