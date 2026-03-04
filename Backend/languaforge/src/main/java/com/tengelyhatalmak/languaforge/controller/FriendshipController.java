package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.model.User;
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

    @PatchMapping("/reject")
    public Friendship rejectFriendship(@RequestParam Integer user1Id, @RequestParam Integer user2Id){
        return friendshipService.rejectFriendship(user1Id, user2Id);
    }

    @PatchMapping("/accept")
    public Friendship acceptFriendRequest(@RequestParam Integer user1Id, @RequestParam Integer user2Id){
        return friendshipService.acceptFriendship(user1Id, user2Id);
    }

    @PostMapping("/sendRequest")
    public Friendship sendFriendRequest(@RequestParam Integer user1Id, @RequestParam Integer user2Id){
        return friendshipService.sendFriendRequest(user1Id, user2Id);
    }

    @GetMapping("user/{userId}/accepted")
    public List<Friendship> getAcceptedFriendshipsByUserId(@PathVariable Integer userId){
        return friendshipService.findAllFriendshipsByUserId(userId).stream()
                .filter(friendship -> friendship.getStatus() == Friendship.FriendshipStatus.accepted).toList();
    }

    @GetMapping("user/{userId}/pending")
    public List<Friendship> getPendingFriendshipsByUserId(@PathVariable Integer userId){
        return friendshipService.findAllFriendshipsByUserId(userId).stream()
                .filter(friendship -> friendship.getStatus() == Friendship.FriendshipStatus.pending).toList();
    }

    @GetMapping("user/{userId}/rejected")
    public List<Friendship> getRejectedFriendshipsByUserId(@PathVariable Integer userId){
        return friendshipService.findAllFriendshipsByUserId(userId).stream()
                .filter(friendship -> friendship.getStatus() == Friendship.FriendshipStatus.rejected).toList();
    }

    @PostMapping("/createFriendship")
    public Friendship createFriendship(@RequestBody Friendship friendship){
        return friendshipService.saveFriendship(friendship);
    }

    @GetMapping("user/{userId}/friendsAsUsers")
    public List<User> getAllFriendsAsUsersByUserId(@PathVariable Integer userId){
        return friendshipService.findFriendsByUserId(userId);
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

    @DeleteMapping("/remove")
    public void removeFriend(@RequestParam Integer user1Id, @RequestParam Integer user2Id){
        Friendship friendShipToRemove = friendshipService.findFriendshipByUserIds(user1Id, user2Id);
        if (friendShipToRemove == null) {
                friendShipToRemove = friendshipService.findFriendshipByUserIds(user2Id, user1Id);
                friendshipService.deleteFriendshipById(friendShipToRemove.getId());
        }
        friendshipService.deleteFriendshipById(friendShipToRemove.getId());
    }


}
