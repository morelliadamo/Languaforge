package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.StoreItem;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.model.UserXItem;
import com.tengelyhatalmak.languaforge.repository.StoreItemRepository;
import com.tengelyhatalmak.languaforge.repository.UserRepository;
import com.tengelyhatalmak.languaforge.repository.UserXItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserXItemServiceImpl implements UserXItemService{

    @Autowired
    private UserXItemRepository userXItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoreItemRepository storeItemRepository;


    @Override
    public UserXItem saveUserXItem(UserXItem userXItem) {
        UserXItem userXItemToSave = new UserXItem();
        userXItemToSave.setAmount(1);

        User user = userRepository.findById(userXItem.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userXItem.getUserId()));
        userXItemToSave.setUser(user);

        StoreItem item = storeItemRepository.findById(userXItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("StoreItem not found with id: " + userXItem.getItemId()));
        userXItemToSave.setStoreItem(item);

        return userXItemRepository.save(userXItemToSave);
    }

    @Override
    public UserXItem findUserXItemById(Integer id) {
        return userXItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserXItem not found"));
    }

    @Override
    public List<UserXItem> findAllUserXItems() {
        return userXItemRepository.findAll();
    }

    @Override
    public List<UserXItem> findUserXItemsByUserId(Integer userId) {
        return userXItemRepository.findByUserId(userId);
    }

    @Override
    public UserXItem updateUserXItem(UserXItem userXItem, Integer id) {
        UserXItem userXItemToUpdate = userXItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserXItem not found"));

        userXItemToUpdate.setAmount(userXItem.getAmount());

        return userXItemRepository.save(userXItemToUpdate);
    }

    @Override
    public String deleteUserXItemById(Integer id) {
        userXItemRepository.deleteById(id);

        return "UserXItem with id: " + id + " has been deleted.";
    }
}
