package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.UserXItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserXItemRepository extends JpaRepository<UserXItem, Integer> {
    List<UserXItem> findByUserId(Integer userId);

    @Query("SELECT uxi FROM UserXItem uxi WHERE uxi.userId = :userId AND uxi.itemId = :itemId AND uxi.amount > 0 ORDER BY uxi.id DESC LIMIT 1")
    UserXItem findByItemIdAndUserId(Integer userId, Integer itemId);
}
