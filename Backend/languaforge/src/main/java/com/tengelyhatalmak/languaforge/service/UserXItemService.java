package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.UserXItem;

import java.util.List;

public interface UserXItemService {

    UserXItem saveUserXItem(UserXItem userXItem);

    UserXItem findUserXItemById(Integer id);
    List<UserXItem> findAllUserXItems();
    List<UserXItem> findUserXItemsByUserId(Integer userId);

    UserXItem updateUserXItem(UserXItem userXItem, Integer id);

    String deleteUserXItemById(Integer id);



}
