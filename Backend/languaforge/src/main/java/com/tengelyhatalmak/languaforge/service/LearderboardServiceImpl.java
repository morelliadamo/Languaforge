package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Leaderboard;
import com.tengelyhatalmak.languaforge.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LearderboardServiceImpl implements LeadeboardService{

    @Autowired
    private LeaderboardRepository leaderboardRepository;


    @Override
    public Leaderboard saveLeaderboard(Leaderboard leaderboard) {
        return leaderboardRepository.save(leaderboard);
    }

    @Override
    public List<Leaderboard> findAllLeaderboards() {
        return leaderboardRepository.findAll();
    }

    @Override
    public Leaderboard findLeaderboardById(Integer id) {
        return leaderboardRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Leaderboard not found"));
    }

    @Override
    public List<Leaderboard> findAllLeaderboardsByCourseId(Integer courseId) {
        return leaderboardRepository.findLeaderboardByCourseId(courseId);
    }

    @Override
    public List<Leaderboard> findAllLeaderboardsByUserId(Integer userId) {
        return leaderboardRepository.findLeaderboardByUserId(userId);
    }

    @Override
    public Leaderboard findLeaderboardByUserIdAndCourseId(Integer userId, Integer courseId) {
        return leaderboardRepository.findLeaderboardByUserIdAndCourseId(userId, courseId);
    }

    @Override
    public Leaderboard findHighestPointsLeaderboardByCourseId(Integer courseId) {
        return leaderboardRepository.findHighestPointsLeaderboardByCourseId(courseId);
    }

    @Override
    public Leaderboard findHighestPointsLeaderboardOverall() {
        return leaderboardRepository.findHighestPointsLeaderboardOverall();
    }

    @Override
    public Leaderboard updateLeaderboard(Leaderboard leaderboard, Integer id) {
        Leaderboard existingLeaderboard = leaderboardRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Leaderboard not found"));

        existingLeaderboard.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        existingLeaderboard.setPoints(leaderboard.getPoints());

        return leaderboardRepository.save(existingLeaderboard);
    }

    @Override
    public Leaderboard softDeleteLeaderboard(Integer id) {
        Leaderboard leaderboardToSoftDelete = leaderboardRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Leaderboard not found"));

        leaderboardToSoftDelete.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        leaderboardToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
        leaderboardToSoftDelete.setIsDeleted(true);

        return leaderboardRepository.save(leaderboardToSoftDelete);
    }

    @Override
    public void hardDeleteLeaderboard(Integer id) {
        System.out.println("Deleting leaderboard with id: "+id);

        leaderboardRepository.deleteById(id);

    }
}
