package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Score;
import com.tengelyhatalmak.languaforge.model.Streak;
import org.springframework.data.redis.stream.StreamListener;

import java.util.List;

public interface StreakService {


    Streak saveStreak(Streak streak);
    List<Streak> findAllStreaks();

    Streak findStreakById(Integer id);
    Streak findStreakByUserId(Integer userId);

    Streak updateStreak(Streak streak, Integer id);
    Streak changeStreakFreezeState(Integer id);


    Streak softDeleteStreak(Integer id);
    void hardDeleteStreak(Integer id);


}
