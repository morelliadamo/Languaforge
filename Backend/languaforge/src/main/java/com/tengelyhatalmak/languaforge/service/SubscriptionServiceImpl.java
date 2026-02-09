package com.tengelyhatalmak.languaforge.service;


import com.tengelyhatalmak.languaforge.model.Subscription;
import com.tengelyhatalmak.languaforge.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

    @Autowired
    private SubscriptionRepository subscriptionRepository;





    @Override
    public List<Subscription> findAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    public Subscription findSubscriptionById(Integer id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Subscription not found with id: " + id));
    }

    @Override
    public Subscription findSubscriptionByUserId(Integer userId) {
        return subscriptionRepository.findSubscriptionByUserId(userId);
    }

    @Override
    public Subscription saveSubscription(Subscription subscription) {
        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription updateSubscription(Subscription subscription, Integer id) {
        Subscription existingSubscription = subscriptionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Subscription not found with id: " + id));

        existingSubscription.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        existingSubscription.setAutoRenew(subscription.getAutoRenew());
        existingSubscription.setPricing(subscription.getPricing());
        existingSubscription.setStatus(subscription.getStatus());

        return subscriptionRepository.save(existingSubscription);
    }

    @Override
    public Subscription changeSubscriptionStatus(Integer id, Integer status) {
        Subscription existingSubscription = subscriptionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Subscription not found with id: " + id));


        switch (status) {
            case 0 -> existingSubscription.setStatus(Subscription.Status.active);
            case 1 -> existingSubscription.setStatus(Subscription.Status.canceled);
            case 2 -> existingSubscription.setStatus(Subscription.Status.expired);
            default -> throw new IllegalArgumentException("Invalid status value: " + status);
        }


        existingSubscription.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return subscriptionRepository.save(existingSubscription);
    }

    @Override
    public Subscription changeSubscriptionAutoRenewal(Integer id) {
        Subscription subscriptionToChangeTheRenewalOf = subscriptionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Subscription not found with id: " + id));

        subscriptionToChangeTheRenewalOf.setAutoRenew(!subscriptionToChangeTheRenewalOf.getAutoRenew());
        subscriptionToChangeTheRenewalOf.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return  subscriptionRepository.save(subscriptionToChangeTheRenewalOf);
    }

    @Override
    public Subscription softDeleteSubscription(Integer id) {
        Subscription subscriptionToSoftDelete = subscriptionRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Subscription not found with id: " + id));

        subscriptionToSoftDelete.setIsDeleted(true);
        subscriptionToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return subscriptionRepository.save(subscriptionToSoftDelete);
    }

    @Override
    public void hardDeleteSubscription(Integer id) {
        System.out.println("Deleting subscription with id: " + id);

        subscriptionRepository.deleteById(id);
    }
}
