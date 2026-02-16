package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Streak;
import com.tengelyhatalmak.languaforge.repository.StreakRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StreakServiceImpl implements StreakService{

    @Autowired
    private StreakRepository streakRepository;


    @Override
    public Streak saveStreak(Streak streak) {

        return streakRepository.save(streak);
    }

    @Override
    public List<Streak> findAllStreaks() {
        return streakRepository.findAll();
    }

    @Override
    public Streak findStreakById(Integer id) {
        return streakRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Streak not found with id: " + id));
    }

    @Override
    public Streak findStreakByUserId(Integer userId) {
        return streakRepository.findStreakByUserID(userId);
    }

    @Override
    public Streak updateStreak(Streak streak, Integer id) {
        Streak existingStreak = streakRepository.findById(id)
                        .orElseThrow(()-> new RuntimeException("Streak not found with id: " + id));

        existingStreak.setCurrentStreak(streak.getCurrentStreak());
        existingStreak.setLongestStreak(streak.getLongestStreak());
        existingStreak.setIsFrozen(streak.getIsFrozen());
        existingStreak.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return streakRepository.save(existingStreak);
    }

    @Override
    public Streak changeStreakFreezeState(Integer id) {
        Streak streakToChangeFreezeStateOf = streakRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Streak not found with id: " + id));

        streakToChangeFreezeStateOf.setIsFrozen(!streakToChangeFreezeStateOf.getIsFrozen());
        streakToChangeFreezeStateOf.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return streakRepository.save(streakToChangeFreezeStateOf);
    }

    @Override
    public Streak softDeleteStreak(Integer id) {
        Streak streakToSoftDelete = streakRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Streak not found with id: " + id));

        streakToSoftDelete.setIsDeleted(true);
        streakToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
        streakToSoftDelete.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return streakRepository.save(streakToSoftDelete);
    }

    @Override
    public void hardDeleteStreak(Integer id) {
        System.out.println("Deleting streak with id: " + id);
        streakRepository.deleteById(id);
    }
}
