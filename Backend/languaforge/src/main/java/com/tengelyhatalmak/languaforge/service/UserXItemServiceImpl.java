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
    public void incrementUserXItemQuantity(Integer userId, String type, Integer incrementBy) {
        switch (type) {
            case "hearts":

                UserXItem heartsToAdd = UserXItem.builder()
                        .userId(userId)
                        .itemId(1)
                        .storeItem(storeItemRepository.findById(1).orElseThrow(() -> new RuntimeException("StoreItem not found with id: 1")))
                        .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId)))
                        .amount(incrementBy)
                        .build();
                userXItemRepository.save(heartsToAdd);
                System.out.println("Hearts incremented for user with id: " + userId + " by " + incrementBy);
                break;
            case "hints":
                UserXItem hintsToAdd = UserXItem.builder()
                        .userId(userId)
                        .itemId(4)
                        .storeItem(storeItemRepository.findById(4).orElseThrow(() -> new RuntimeException("StoreItem not found with id: 1")))
                        .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId)))
                        .amount(incrementBy)
                        .build();
                userXItemRepository.save(hintsToAdd);
                System.out.println("Hints incremented for user with id: " + userId + " by " + incrementBy);
                break;
            case "freezes":
                UserXItem freezesToAdd = UserXItem.builder()
                        .userId(userId)
                        .itemId(7)
                        .storeItem(storeItemRepository.findById(7).orElseThrow(() -> new RuntimeException("StoreItem not found with id: 1")))
                        .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId)))
                        .amount(incrementBy)
                        .build();
                userXItemRepository.save(freezesToAdd);
                System.out.println("Freezes incremented for user with id: " + userId + " by " + incrementBy);
                break;
            case "course_slots":
                UserXItem courseSlotsToAdd = UserXItem.builder()
                        .userId(userId)
                        .itemId(8)
                        .storeItem(storeItemRepository.findById(8).orElseThrow(() -> new RuntimeException("StoreItem not found with id: 1")))
                        .user(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId)))
                        .amount(incrementBy)
                        .build();
                userXItemRepository.save(courseSlotsToAdd);
                System.out.println("Course slots incremented for user with id: " + userId + " by " + incrementBy);
                break;

                default:
                    throw new IllegalArgumentException("Invalid item type: " + type);
        }
    }

    @Override
    public void decrementUserXItemQuantity(Integer userId, String type, Integer decrementBy) {
        switch (type){
            case "hearts":
                try{
                    UserXItem itemToRemove = userXItemRepository.findByItemIdAndUserId(userId, 1);
                    if (itemToRemove != null) {
                        userXItemRepository.delete(itemToRemove);

                        System.out.println("Hearts decremented for user with id: " + userId + " by " + decrementBy);
                    } else {
                        System.out.println("No hearts to decrement for user with id: " + userId);
                    }
                } catch (Exception e) {
                    System.out.println("Error decrementing hearts for user with id: " + userId + ": " + e.getMessage());
                }
                break;
            case "hints":
                try{
                    UserXItem itemToRemove = userXItemRepository.findByItemIdAndUserId(userId, 4);
                    if (itemToRemove != null) {
                        userXItemRepository.delete(itemToRemove);
                        System.out.println("Hints decremented for user with id: " + userId + " by " + decrementBy);
                    } else {
                        System.out.println("No hints to decrement for user with id: " + userId);
                    }
                } catch (Exception e) {
                    System.out.println("Error decrementing hints for user with id: " + userId + ": " + e.getMessage());
                }
                break;
            case "freezes":
                try {
                    UserXItem itemToRemove = userXItemRepository.findByItemIdAndUserId(userId, 7);
                    if (itemToRemove != null) {
                        userXItemRepository.delete(itemToRemove);

                        System.out.println("Freezes decremented for user with id: " + userId + " by " + decrementBy);
                    } else {
                        System.out.println("No freezes to decrement for user with id: " + userId);
                    }
                } catch (Exception e) {
                    System.out.println("Error decrementing freezes for user with id: " + userId + ": " + e.getMessage());
                }
                break;
            case "course_slots":
                try {
                    UserXItem itemToRemove = userXItemRepository.findByItemIdAndUserId(userId, 8);
                    if (itemToRemove != null) {
                        userXItemRepository.delete(itemToRemove);

                        System.out.println("Course slots decremented for user with id: " + userId + " by " + decrementBy);
                    } else {
                        System.out.println("No course slots to decrement for user with id: " + userId);
                    }
                } catch (Exception e) {
                    System.out.println("Error decrementing course slots for user with id: " + userId + ": " + e.getMessage());
                }
                break;

            default:
                throw new IllegalArgumentException("Invalid item type: " + type);
        }
    }

    @Override
    public String deleteUserXItemById(Integer id) {
        userXItemRepository.deleteById(id);

        return "UserXItem with id: " + id + " has been deleted.";
    }
}
