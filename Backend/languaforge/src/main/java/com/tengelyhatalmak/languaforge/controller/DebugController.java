package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.domainevent.LessonCompletedDE;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/debug")
@RequiredArgsConstructor
public class DebugController {

    private final ApplicationEventPublisher eventPublisher;


    @GetMapping("/unlockLessonAchievement/user/{userId}/lesson/{lessonId}")
    public String triggerFakeLessonCompletion(
            @PathVariable Integer userId,
            @PathVariable Integer lessonId) {

        eventPublisher.publishEvent(
                new LessonCompletedDE(
                        this,
                        userId,
                        lessonId
                )
        );

        return "Fake LessonCompletedEvent published for user " + userId;
    }

}
