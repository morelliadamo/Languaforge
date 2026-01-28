package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Exercise;
import com.tengelyhatalmak.languaforge.model.Friendship;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.List;

public interface FriendshipService {

    Friendship saveFriendship(Friendship friendship);

    List<Friendship> findAllFriendships();
    Friendship findFriendshipById(Integer id);
    List<Friendship> findAllFriendshipsByUserId(Integer userId);
    Friendship updateFriendship(Friendship friendship, Integer id);
    Friendship softDeleteFriendshipById(Integer id);
    void deleteFriendshipById(Integer id);


}
