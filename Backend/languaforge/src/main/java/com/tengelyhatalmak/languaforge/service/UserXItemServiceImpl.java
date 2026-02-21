package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.UserXItem;
import com.tengelyhatalmak.languaforge.repository.UserXItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserXItemServiceImpl implements UserXItemService{

    @Autowired
    private UserXItemRepository userXItemRepository;

    @Override
    public UserXItem saveUserXItem(UserXItem userXItem) {
        return userXItemRepository.save(userXItem);
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
