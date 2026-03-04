package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Friendship;
import com.tengelyhatalmak.languaforge.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT fr FROM Friendship fr WHERE fr.user1Id = :userId OR fr.user2Id = :userId AND fr.isDeleted = false")
    List<Friendship> findAllFriendshipsByUserId(Integer userId);


    @Query("SELECT fr FROM Friendship fr WHERE fr.user1Id = :user1Id AND fr.user2Id = :user2Id AND fr.isDeleted = false")
    Friendship findFriendshipByUserIdsStrict(Integer user1Id, Integer user2Id);

}
