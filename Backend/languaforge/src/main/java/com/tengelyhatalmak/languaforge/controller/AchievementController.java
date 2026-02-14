package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Achievement;
import com.tengelyhatalmak.languaforge.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;


    @GetMapping("/")
    public List<Achievement> getAllAchievements(){
        return achievementService.findAllAchievements();
    }

    @GetMapping("/{id}")
    public Achievement getAchievementById(@PathVariable Integer id){
        return achievementService.findAchievementById(id);
    }

    @PostMapping("/createAchievement")
    public Achievement createAchievement(@RequestBody Achievement achievement){
        return achievementService.saveAchievement(achievement);
    }

    @PatchMapping("/softDeleteAchievement/{id}")
    public Achievement softDeleteAchievement(@PathVariable Integer id){
        return achievementService.softDeleteAchievement(id);
    }


    @PatchMapping("/restoreAchievement/{id}")
    public Achievement restoreAchievement(@PathVariable Integer id){
        return achievementService.restoreAchievement(id);
    }

    @PutMapping("/updateAchievement/{id}")
    public Achievement updateAchievement(@RequestBody Achievement achievement, @PathVariable Integer id){
        return achievementService.updateAchievement(achievement, id);
    }

    @DeleteMapping("/hardDeleteAchievement/{id}")
    public void hardDeleteAchievement(@PathVariable Integer id){
        achievementService.hardDeleteAchievement(id);
    }

}
