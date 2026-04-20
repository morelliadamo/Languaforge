package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.UserXItem;

import java.util.List;

public interface UserXItemService {

    UserXItem saveUserXItem(UserXItem userXItem);

    UserXItem findUserXItemById(Integer id);
    List<UserXItem> findAllUserXItems();
    List<UserXItem> findUserXItemsByUserId(Integer userId);
    UserXItem findUserXItemsByUserIdAndItemId(Integer userId, Integer itemId);

    UserXItem updateUserXItem(UserXItem userXItem, Integer id);
    void incrementUserXItemQuantity(Integer userId, String type, Integer incrementBy);
    void decrementUserXItemQuantity(Integer userId, String type, Integer decrementBy);


    String deleteUserXItemById(Integer id);



}
