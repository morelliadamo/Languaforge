package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendships")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;


    @GetMapping("/")
    public List<Friendship> getALlFriendships(){
        return friendshipService.findAllFriendships();
    }

    @GetMapping("/{friendshipId}")
    public Friendship getFriendshipById(@PathVariable Integer friendshipId){
        return friendshipService.findFriendshipById(friendshipId);
    }

    @GetMapping("user/{userId}")
    public List<Friendship> getAllFriendshipsByUserId(@PathVariable Integer userId){
        return friendshipService.findAllFriendshipsByUserId(userId);
    }

    @PutMapping("/updateFriendship/{friendshipId}")
    public Friendship updateFriendship(@RequestBody Friendship friendship, @PathVariable Integer friendshipId){
        return friendshipService.updateFriendship(friendship, friendshipId);
    }

    @PatchMapping("/softDeleteFriendship/{friendshipId}")
    public Friendship softDeleteFriendship(@PathVariable Integer friendshipId){
        return friendshipService.softDeleteFriendshipById(friendshipId);
    }

    @DeleteMapping("/hardDeleteFriendship/{friendshipId}")
    public void hardDeleteFriendship(@PathVariable Integer friendshipId){
        friendshipService.deleteFriendshipById(friendshipId);
    }


}
