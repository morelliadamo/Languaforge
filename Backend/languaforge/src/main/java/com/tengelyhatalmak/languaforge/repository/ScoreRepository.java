package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Integer> {
    @Query("SELECT s FROM Score s WHERE s.user.id = :userId")
    public List<Score> findScoresByUserId(@Param("userId") Integer userId);
}
