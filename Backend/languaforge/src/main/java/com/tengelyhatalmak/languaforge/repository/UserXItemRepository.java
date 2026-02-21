package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.UserXItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserXItemRepository extends JpaRepository<UserXItem, Integer> {
    List<UserXItem> findByUserId(Integer userId);
}
