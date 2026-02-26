package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.dto.AchievementUnlockedDTO;
import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.model.AchievementEarnCondition;
import com.tengelyhatalmak.languaforge.model.UserXAchievement;
import com.tengelyhatalmak.languaforge.repository.AchievementRepository;
import com.tengelyhatalmak.languaforge.repository.LessonProgressRepository;
import com.tengelyhatalmak.languaforge.repository.UserXAchievementRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import com.tengelyhatalmak.languaforge.domainevent.LessonCompletedDE;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AchievementUnlockService {

    @Autowired
    private AchievementRepository achievementRepository;
    @Autowired
    private UserXAchievementRepository userXAchievementRepository;
    @Autowired
    private LessonProgressRepository lessonProgressRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ApplicationEventPublisher eventPublisher;


    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onLessonCompleted(LessonCompletedDE event){
        System.out.println("All achievements: " +
                achievementRepository.findAllByIsDeletedFalse().size());
        achievementRepository.findAllByIsDeletedFalse()
                .forEach(a -> System.out.println(
                        "Achievement: " + a.getName() +
                                " Condition: " +
                                (a.getEarnCondition() != null ?
                                        a.getEarnCondition().getCondition() : "NULL")
                ));
        System.out.println(">>> ACHIEVEMENT LISTENER STARTED for user " + event.getUserId()+" "+this.hashCode());
        Integer userId = event.getUserId();
        Integer lessonId = event.getLessonId();

        Set<Integer> alreadyErnedAchievementIds = userXAchievementRepository.findAchievementIdsByUserId(userId);

        achievementRepository.findAllByIsDeletedFalse().stream()
                .filter(achievement -> !alreadyErnedAchievementIds.contains(achievement.getId()))
                .filter(achievement -> "LESSONS_COMPLETED".equals(achievement.getEarnCondition().getCondition()))
                //||add here )other achievement types will be added, waiting for the tékozling boy soma
                .forEach(achievement -> checkAchievement(userId, achievement));
        System.out.println(">>> ACHIEVEMENT LISTENER ENDED for user " + event.getUserId()+" "+this.hashCode());

    }


    private void checkAchievement(Integer userId, Achievement achievement){
        System.out.println("Checking achievement: " + achievement.getName() + " for user: " + userId);
        AchievementEarnCondition achievementEarnCondition = achievement.getEarnCondition();
        boolean isUnlocked = switch (achievementEarnCondition.getCondition()){

            case "LESSONS_COMPLETED" -> {

                Integer requiredCount = Integer.parseInt(achievementEarnCondition.getValue());
                Integer completedLessons = lessonProgressRepository.findCompletedCountByUserId(userId);
                System.out.println("Completed lessons count: " + completedLessons);
                System.out.println("Required count: " + requiredCount);
                yield completedLessons >= requiredCount;
            }
            //other achievement types will be added, waiting for the tékozling boy soma
            default -> {
                System.out.println("Unknown achievement condition: " + achievementEarnCondition.getCondition());
                yield false;
            }
        };

        if (isUnlocked){
            awardAchievement(userId, achievement);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void awardAchievement(Integer userId, Achievement achievement){
        UserXAchievement userXAchievement = UserXAchievement.builder()
                .userId(userId)
                .achievementId(achievement.getId())
                .earnedAt(Timestamp.valueOf(LocalDateTime.now()))
                .build();

        userXAchievementRepository.save(userXAchievement);


        messagingTemplate.convertAndSend/*ToUser*/(
//                userId.toString(),
                "/topic/achievements/unlocked",
                new AchievementUnlockedDTO(
                        achievement.getId(),
                        achievement.getName(),
                        achievement.getDescription(),
                        achievement.getIconUrl(),
                        userXAchievement.getEarnedAt()
                )
        );
        System.out.println(">>> Achievement unlocked: " + achievement.getName() + " for user: " + userId);
    }

    @PostConstruct
    public void init() {
        System.out.println(">>> AchievementUnlockService initialized " + this.hashCode());
    }
}
