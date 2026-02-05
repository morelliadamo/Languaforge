package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.model.Leaderboard;

import java.util.List;

public interface LeadeboardService {
    Leaderboard saveLeaderboard(Leaderboard leaderboard);

    List<Leaderboard> findAllLeaderboards();
    Leaderboard findLeaderboardById(Integer id);
    List<Leaderboard> findAllLeaderboardsByCourseId(Integer courseId);
    List<Leaderboard> findAllLeaderboardsByUserId(Integer userId);
    Leaderboard findLeaderboardByUserIdAndCourseId(Integer userId, Integer courseId);
    Leaderboard findHighestPointsLeaderboardByCourseId(Integer courseId);
    Leaderboard findHighestPointsLeaderboardOverall();

    Leaderboard updateLeaderboard(Leaderboard leaderboard, Integer id);

    Leaderboard softDeleteLeaderboard(Integer id);
    void deleteLeaderboard(Integer id);
}
