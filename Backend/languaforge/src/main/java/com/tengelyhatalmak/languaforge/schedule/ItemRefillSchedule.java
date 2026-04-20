package com.tengelyhatalmak.languaforge.schedule;

import com.tengelyhatalmak.languaforge.repository.UserXItemRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemRefillSchedule {

    @Autowired
    private final UserXItemRepository userXItemRepository;

    @Getter
    private Instant nextRefillAt;

    @PostConstruct
    public void init(){
        nextRefillAt = Instant.now().plusMillis(900_000);
    }

    @Scheduled(fixedRate = 900_000)
    @Transactional
    public void refillHeartsAndHints(){
        int heartsUpdated = userXItemRepository.incrementHeartsForAllUsers();
        int hintsUpdated = userXItemRepository.incrementHintsForAllUsers();
        nextRefillAt = Instant.now().plusMillis(900_000);
        log.debug("Refill: {} hearts, {} hints incremented.\nNext refill at: {}", heartsUpdated, hintsUpdated, nextRefillAt);
    }


}
