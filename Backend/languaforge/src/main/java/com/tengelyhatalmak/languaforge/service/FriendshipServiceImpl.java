package com.tengelyhatalmak.languaforge.service;


import com.tengelyhatalmak.languaforge.domainevent.FriendAddedDE;
import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.FriendshipRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    private ApplicationEventPublisher eventPublisher;

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
    public Friendship findFriendshipByUserIds(Integer user1Id, Integer user2Id) {
        return friendshipRepository.findFriendshipByUserIdsStrict(user1Id, user2Id);
    }




    @Override
    public Friendship updateFriendship(Friendship friendship, Integer id) {
        Friendship existingFriendship = friendshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Friendship not found"));

        existingFriendship.setStatus(friendship.getStatus());

        return friendshipRepository.save(existingFriendship);
    }

    @Override
    public Friendship rejectFriendship(Integer user1Id, Integer user2Id) {
        Friendship friendshipToReject = friendshipRepository.findFriendshipByUserIdsStrict(user1Id, user2Id);

        if (friendshipToReject == null) {
            throw new RuntimeException("Friendship not found between user1Id: " + user1Id + " and user2Id: " + user2Id);
        }

        friendshipToReject.setStatus(Friendship.FriendshipStatus.rejected);

        return friendshipRepository.save(friendshipToReject);
    }

    @Override
    public Friendship acceptFriendship(Integer user1Id, Integer user2Id) {
        Friendship friendshipToAccept = friendshipRepository.findFriendshipByUserIdsStrict(user1Id, user2Id);

        if (friendshipToAccept == null) {
            throw new RuntimeException("Friendship not found between user1Id: " + user1Id + " and user2Id: " + user2Id);
        }

        friendshipToAccept.setStatus(Friendship.FriendshipStatus.accepted);

        return friendshipRepository.save(friendshipToAccept);
    }

    @Override
    @Transactional
    public Friendship sendFriendRequest(Integer user1Id, Integer user2Id) {
        new Friendship();
        Friendship sentFriendRequest = Friendship.builder()
                .user1Id(user1Id)
                .user2Id(user2Id)
                .status(Friendship.FriendshipStatus.pending)
                .build();



        eventPublisher.publishEvent(new FriendAddedDE(this, user1Id, user2Id));

        return friendshipRepository.save(sentFriendRequest);

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
