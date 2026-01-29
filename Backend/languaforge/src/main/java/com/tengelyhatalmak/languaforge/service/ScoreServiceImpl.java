package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Score;
import com.tengelyhatalmak.languaforge.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreServiceImpl implements ScoreService{

    @Autowired
    private ScoreRepository scoreRepository;

    @Override
    public Score saveScore(Score score) {
        return scoreRepository.save(score);
    }

    @Override
    public List<Score> findAllScores() {
        return scoreRepository.findAll();
    }

    @Override
    public Score findScoreById(Integer id) {
        return scoreRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Score not found"));
    }

    @Override
    public List<Score> findScoresByUserId(Integer userId) {
        return scoreRepository.findScoresByUserId(userId);
    }

    @Override
    public Score updateScore(Score score, Integer id) {
        Score existingScore = scoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Score not found"));

        existingScore.setScore(score.getScore());

        return scoreRepository.save(existingScore);
    }

    @Override
    public Score softDeleteScore(Integer id) {
        Score scoreToSoftDelete = scoreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Score not found"));

        scoreToSoftDelete.setIsDeleted(true);

        return scoreRepository.save(scoreToSoftDelete);
    }

    @Override
    public void deleteScore(Integer id) {
        System.out.println("Deleting score with id: "+id);

        scoreRepository.deleteById(id);
    }
}
