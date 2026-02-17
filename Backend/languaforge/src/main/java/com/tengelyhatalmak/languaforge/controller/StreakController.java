package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Streak;
import com.tengelyhatalmak.languaforge.service.StreakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/streaks")
public class StreakController {

    @Autowired
    private StreakService streakService;


    @GetMapping("/")
    public List<Streak> getAllStreaks() {
        return streakService.findAllStreaks();
    }

    @GetMapping("/{id}")
    public Streak getStreakById(@PathVariable Integer id) {
        return streakService.findStreakById(id);
    }


    @GetMapping("/user/{userId}")
    public Streak getStreakByUserId(@PathVariable Integer userId) {
        return streakService.findStreakByUserId(userId);
    }

    @PutMapping("/updateStreak/{id}")
    public Streak updateStreak(@RequestBody Streak streak, @PathVariable Integer id) {
        return streakService.updateStreak(streak, id);
    }

    @PatchMapping("/changeFreezeState/{id}")
    public Streak changeStreakFreezeState(@PathVariable Integer id) {
        return streakService.changeStreakFreezeState(id);
    }

    @PatchMapping("/softDeleteStreak/{id}")
    public Streak softDeleteStreak(@PathVariable Integer id) {
        return streakService.softDeleteStreak(id);
    }

    @DeleteMapping("/hardDeleteStreak/{id}")
    public void hardDeleteStreak(@PathVariable Integer id) {
        streakService.hardDeleteStreak(id);
    }

}
