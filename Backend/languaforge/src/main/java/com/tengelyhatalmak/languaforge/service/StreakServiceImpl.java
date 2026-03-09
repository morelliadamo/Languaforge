package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.domainevent.StreakAchievedDE;
import com.tengelyhatalmak.languaforge.model.Streak;
import com.tengelyhatalmak.languaforge.repository.StreakRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StreakServiceImpl implements StreakService{

    @Autowired
    private StreakRepository streakRepository;



    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

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
    public Streak fixStreakByUserId(Integer userId) {
        Streak streak = streakRepository.findStreakByUserID(userId);

        LocalDate today = LocalDate.now();
        LocalDate lastActive = streak.getUpdatedAt()
                .toLocalDateTime()
                .toLocalDate();

        if (lastActive.equals(today)) {
            if (streak.getLongestStreak() >= 3){
                eventPublisher.publishEvent(new StreakAchievedDE(this, streak.getUser().getId(), streak.getCurrentStreak()));
            }
            return streak;
        }

        if (!lastActive.plusDays(1).equals(today)) {
            streak.setCurrentStreak(0);
        }

        streak.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));



        return streakRepository.save(streak);
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
    @Transactional
    public Streak incrementOrCreateStreak(Integer userId) {
        try {
            Streak streak = streakRepository.findStreakByUserID(userId);

            int newCurrent = streak.getCurrentStreak() + 1;
            streak.setCurrentStreak(newCurrent);

            if (newCurrent > streak.getLongestStreak()) {
                streak.setLongestStreak(newCurrent);
            }

            if (streak.getLongestStreak() >= 3){
                eventPublisher.publishEvent(new StreakAchievedDE(this, streak.getUser().getId(), streak.getCurrentStreak()));
            }

            return streakRepository.save(streak);
        } catch (Exception ex) {
            Streak newStreak = new Streak();
            newStreak.setUser(userRepository.findById(userId).orElseThrow());
            newStreak.setCurrentStreak(1);
            newStreak.setLongestStreak(1);
            newStreak.setIsFrozen(false);
            newStreak.setIsDeleted(false);
            newStreak.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
            return streakRepository.save(newStreak);
        }

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
