package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.Score;

import java.util.List;

public interface ScoreService {
    Score saveScore(Score score);
    List<Score> findAllScores();

    Score findScoreById(Integer id);
    List<Score> findScoresByUserId(Integer userId);

    Score updateScore(Score score, Integer id);

    Score softDeleteScore(Integer id);
    void deleteScore(Integer id);

}
