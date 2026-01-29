package com.tengelyhatalmak.languaforge.controller;


import com.tengelyhatalmak.languaforge.model.Score;
import com.tengelyhatalmak.languaforge.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scores")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;


    @GetMapping("/")
    public List<Score> getAllScores(){
        return scoreService.findAllScores();
    }

    @GetMapping("/{id}")
    public Score getScoreById(Integer id){
        return scoreService.findScoreById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Score> getScoresByUserId(Integer userId){
        return scoreService.findScoresByUserId(userId);
    }

    @PostMapping("/createScore")
    public Score createScore(@RequestBody Score score){
        return scoreService.saveScore(score);
    }

    @PutMapping("/updateScore/{id}")
    public Score updateScore(@RequestBody Score score, @PathVariable Integer id){
        return scoreService.updateScore(score, id);
    }

    @PatchMapping("/softDeleteScore/{id}")
    public Score softDeleteScore(@PathVariable Integer id){
        return scoreService.softDeleteScore(id);
    }

    @DeleteMapping("/hardDeleteScore/{id}")
    public void hardDeleteScore(@PathVariable Integer id){
        scoreService.deleteScore(id);
    }



}
