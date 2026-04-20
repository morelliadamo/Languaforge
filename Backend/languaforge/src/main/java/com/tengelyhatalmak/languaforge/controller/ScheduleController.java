package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.schedule.ItemRefillSchedule;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    @Autowired
    private final ItemRefillSchedule itemRefillSchedule;



    @GetMapping("/nextItemRefill")
    public Map<String, Long> getTimeUntilNextRefill(){
        long remainingMillis = Duration.between(Instant.now(), itemRefillSchedule.getNextRefillAt()).toMillis();
        return Map.of("remainingMillis", Math.max(remainingMillis, 0));
    }



}
