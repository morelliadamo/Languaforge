package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {
    @Query("SELECT fr FROM Friendship fr WHERE fr.user1Id = :userId OR fr.user2Id = :userId AND fr.isDeleted = false")
    List<Friendship> findAllFriendshipsByUserId(Integer userId);


}
