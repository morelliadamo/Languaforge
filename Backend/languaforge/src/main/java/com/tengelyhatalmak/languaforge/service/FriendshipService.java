package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.model.User;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.List;

public interface FriendshipService {

    Friendship saveFriendship(Friendship friendship);

    List<Friendship> findAllFriendships();
    Friendship findFriendshipById(Integer id);
    List<Friendship> findAllFriendshipsByUserId(Integer userId);
    Friendship findFriendshipByUserIds(Integer user1Id, Integer user2Id);
    Friendship updateFriendship(Friendship friendship, Integer id);

    Friendship rejectFriendship(Integer user1Id, Integer user2Id);
    Friendship acceptFriendship(Integer user1Id, Integer user2Id);
    Friendship sendFriendRequest(Integer user1Id, Integer user2Id);

    Friendship softDeleteFriendshipById(Integer id);
    void deleteFriendshipById(Integer id);

    List<User> findFriendsByUserId(Integer userId);

}
