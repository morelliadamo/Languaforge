package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Leaderboard;
import com.tengelyhatalmak.languaforge.service.LeadeboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboards")
public class LeaderboardController {

    @Autowired
    private LeadeboardService leaderboardService;


    @GetMapping("/")
    public List<Leaderboard> getAllLeaderboards(){
        return leaderboardService.findAllLeaderboards();
    }

    @GetMapping("/{id}")
    public Leaderboard getLeaderboardById(@PathVariable Integer id){
        return leaderboardService.findLeaderboardById(id);
    }


    @GetMapping("/course/{courseId}")
    public List<Leaderboard> getLeaderboardsByCourseId(@PathVariable Integer courseId){
        return leaderboardService.findAllLeaderboardsByCourseId(courseId);
    }

    @GetMapping("/user/{userId}")
    public List<Leaderboard> getLeaderboardsByUserId(@PathVariable Integer userId){
        return leaderboardService.findAllLeaderboardsByUserId(userId);
    }

    @GetMapping("/course/{courseId}/user/{userId}")
    public Leaderboard getLeaderboardByUserIdAndCourseId(@PathVariable Integer userId, @PathVariable Integer courseId){
        return leaderboardService.findLeaderboardByUserIdAndCourseId(userId, courseId);
    }


    @GetMapping("/course/{courseId}/highest")
    public Leaderboard getHighestPointsLeaderboardByCourseId(@PathVariable Integer courseId){
        return leaderboardService.findHighestPointsLeaderboardByCourseId(courseId);
    }

    @GetMapping("/highest")
    public Leaderboard getLeaderboardHighestPointsOverall(){
        return leaderboardService.findHighestPointsLeaderboardOverall();
    }


    @PutMapping("update/{id}")
    public Leaderboard updateLeaderboard(@RequestBody Leaderboard leaderboard, @PathVariable Integer id){
        return leaderboardService.updateLeaderboard(leaderboard, id);
    }

    @PatchMapping("/softDelete/{id}")
    public Leaderboard softDeleteLeaderboard(@PathVariable Integer id){
        return leaderboardService.softDeleteLeaderboard(id);
    }

    @DeleteMapping("/hardDelete/{id}")
    public void hardDeleteLeaderboard(@PathVariable Integer id){
        leaderboardService.hardDeleteLeaderboard(id);
    }







}
