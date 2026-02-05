package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, Integer> {


    @Query("SELECT l FROM Leaderboard l WHERE l.course.id = :courseId ORDER BY l.points DESC LIMIT 1")
    Leaderboard findHighestPointsLeaderboardByCourseId(Integer courseId);

    @Query("SELECT l FROM Leaderboard l WHERE l.points = MAX(l.points)")
    Leaderboard findHighestPointsLeaderboardOverall();

    List<Leaderboard> findLeaderboardByCourseId(Integer courseId);

    List<Leaderboard> findLeaderboardByUserId(Integer userId);

    Leaderboard findLeaderboardByUserIdAndCourseId(Integer userId, Integer courseId);
}
