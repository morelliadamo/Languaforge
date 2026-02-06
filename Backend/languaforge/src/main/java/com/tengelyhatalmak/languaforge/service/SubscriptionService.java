package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Subscription;

import java.util.List;

public interface SubscriptionService {
    List<Subscription> findAllSubscriptions();
    Subscription findSubscriptionById(Integer id);

    Subscription saveSubscription(Subscription subscription);

    Subscription updateSubscription(Subscription subscription, Integer id);


    /**
     * Comment start
     * @param status the status of the subscription, 0 for active, 1 for cancelled, 2 for expired
     * @param id the identifier of the subscription to be updated
     * @return the updated subscription
     */
    Subscription changeSubscriptionStatus(Integer id, Integer status);

    Subscription changeSubscriptionAutoRenewal(Integer id);


    Subscription softDeleteSubscription(Integer id);
    void hardDeleteSubscription(Integer id);
}
