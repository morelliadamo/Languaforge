package com.tengelyhatalmak.languaforge.repository;

import com.tengelyhatalmak.languaforge.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {


    @Query("SELECT s FROM Subscription s Where s.user.id = :userId and s.isDeleted = false")
    public Subscription findSubscriptionByUserId(Integer userId);
}
