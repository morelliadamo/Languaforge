package com.tengelyhatalmak.languaforge.service;


import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.FriendshipRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FriendshipServiceImpl implements FriendshipService {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public Friendship saveFriendship(Friendship friendship) {
        return friendshipRepository.save(friendship);
    }

    @Override
    public List<Friendship> findAllFriendships() {
        return friendshipRepository.findAll();
    }

    @Override
    public Friendship findFriendshipById(Integer id) {
        return friendshipRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Friendship not found"));
    }

    @Override
    public List<Friendship> findAllFriendshipsByUserId(Integer userId) {
            return friendshipRepository.findAllFriendshipsByUserId(userId);
    }

    @Override
    public Friendship updateFriendship(Friendship friendship, Integer id) {
        Friendship existingFriendship = friendshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        existingFriendship.setStatus(friendship.getStatus());

        return friendshipRepository.save(existingFriendship);
    }

    @Override
    public Friendship softDeleteFriendshipById(Integer id) {
        Friendship friendshipToSoftDelete = friendshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        friendshipToSoftDelete.setIsDeleted(true);
        friendshipToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return friendshipRepository.save(friendshipToSoftDelete);
    }

    @Override
    public void deleteFriendshipById(Integer id) {
        friendshipRepository.deleteById(id);
        System.out.println("Friendship with id: "+id+" deleted");
    }

    @Override
    public List<User> findFriendsByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Friendship> friendships = friendshipRepository.findAllFriendshipsByUserId(userId);
        List<User> friendsOfUser = new ArrayList<>();

        for (Friendship f : friendships) {
            if (userRepository.findById(f.getUser1Id()).isPresent()) {
                User friend = userRepository.findById(f.getUser1Id()).get();
                if (!friend.getId().equals(userId)) {
                    friendsOfUser.add(friend);
                }
            }
            if (userRepository.findById(f.getUser2Id()).isPresent()) {
                User friend = userRepository.findById(f.getUser2Id()).get();
                if (!friend.getId().equals(userId)) {
                    friendsOfUser.add(friend);
                }
            }
        }

        return friendsOfUser;
    }
}
