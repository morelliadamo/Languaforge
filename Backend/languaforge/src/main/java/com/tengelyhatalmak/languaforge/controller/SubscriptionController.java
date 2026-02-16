package com.tengelyhatalmak.languaforge.controller;


import com.tengelyhatalmak.languaforge.model.Subscription;
import com.tengelyhatalmak.languaforge.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;


    @GetMapping("/")
    public List<Subscription> getAllSubscriptions(){
        return subscriptionService.findAllSubscriptions();
    }

    @GetMapping("/{id}")
    public Subscription getSubscriptionById(@PathVariable Integer id){
        return subscriptionService.findSubscriptionById(id);
    }

    @GetMapping("/user/{userId}")
    public Subscription getSubscriptionByUserId(@PathVariable Integer userId){
        return subscriptionService.findSubscriptionByUserId(userId);
    }


    @PostMapping("/createSubscription")
    public Subscription createSubscription(@RequestBody Subscription subscription){
        return subscriptionService.saveSubscription(subscription);
    }


    @PutMapping("/updateSubscription/{id}")
    public Subscription updateSubscription(@RequestBody Subscription subscription, @PathVariable Integer id){
        return subscriptionService.updateSubscription(subscription, id);
    }



    @PatchMapping("/{id}/status/{statusCode}")
    public Subscription changeSubscriptionStatus(@PathVariable Integer id,@PathVariable Integer statusCode){
        return subscriptionService.changeSubscriptionStatus(id, statusCode);
    }


    @PatchMapping("/{id}/renewal")
    public Subscription changeSubscriptionAutoRenewal(@PathVariable Integer id){
        return subscriptionService.changeSubscriptionAutoRenewal(id);
    }


    @PatchMapping("/softDeleteSubscription/{id}")
    public Subscription softDeleteSubscription(@PathVariable Integer id){
        return subscriptionService.softDeleteSubscription(id);
    }



    @DeleteMapping("/hardDeleteSubscription/{id}")
    public void hardDeleteSubscription(@PathVariable Integer id){
        subscriptionService.hardDeleteSubscription(id);
    }

}
