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
    public UserXItem findUserXItemsByUserIdAndItemId(Integer userId, Integer itemId) {
        return userXItemRepository.findByUserIdAndItemId(userId, itemId);
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
            case "hearts": {
                UserXItem userXItemToIncrement = userXItemRepository.findByUserIdAndItemId(userId, 1);
                userXItemToIncrement.setAmount(userXItemToIncrement.getAmount() + incrementBy);
                userXItemRepository.save(userXItemToIncrement);

                System.out.println("Hearts incremented for user with id: " + userId + " by " + incrementBy);
                break;
            }
                case "hints": {
                UserXItem userXItemToIncrement = userXItemRepository.findByUserIdAndItemId(userId, 2);
                userXItemToIncrement.setAmount(userXItemToIncrement.getAmount() + incrementBy);
                userXItemRepository.save(userXItemToIncrement);

                System.out.println("Hints incremented for user with id: " + userId + " by " + incrementBy);
                break;
            }
                case "freezes": {
                UserXItem userXItemToIncrement = userXItemRepository.findByUserIdAndItemId(userId, 3);
                userXItemToIncrement.setAmount(userXItemToIncrement.getAmount() + incrementBy);
                userXItemRepository.save(userXItemToIncrement);

                System.out.println("Freezes incremented for user with id: " + userId + " by " + incrementBy);
                break;
            }
                case "course_slots": {
                    UserXItem userXItemToIncrement = userXItemRepository.findByUserIdAndItemId(userId, 4);
                    userXItemToIncrement.setAmount(userXItemToIncrement.getAmount() + incrementBy);
                    userXItemRepository.save(userXItemToIncrement);


                    System.out.println("Course slots incremented for user with id: " + userId + " by " + incrementBy);
                    break;
                }
                default:
                    throw new IllegalArgumentException("Invalid item type: " + type);
        }
    }

    @Override
    public void decrementUserXItemQuantity(Integer userId, String type, Integer decrementBy) {
        switch (type){
            case "hearts": {
                UserXItem userXItemToDecrement = userXItemRepository.findByUserIdAndItemId(userId, 1);
                userXItemToDecrement.setAmount(userXItemToDecrement.getAmount() - decrementBy);
                userXItemRepository.save(userXItemToDecrement);


                System.out.println("Hearts decremented for user with id: " + userId + " by " + decrementBy);
                break;
            }
            case "hints": {
                UserXItem userXItemToDecrement = userXItemRepository.findByUserIdAndItemId(userId, 2);
                userXItemToDecrement.setAmount(userXItemToDecrement.getAmount() - decrementBy);
                userXItemRepository.save(userXItemToDecrement);


                System.out.println("Hints decremented for user with id: " + userId + " by " + decrementBy);
                break;
            }
            case "freezes": {
                UserXItem userXItemToDecrement = userXItemRepository.findByUserIdAndItemId(userId, 3);
                userXItemToDecrement.setAmount(userXItemToDecrement.getAmount() - decrementBy);
                userXItemRepository.save(userXItemToDecrement);


                System.out.println("Freezes decremented for user with id: " + userId + " by " + decrementBy);
                break;
            }
            case "course_slots": {
                UserXItem userXItemToDecrement = userXItemRepository.findByUserIdAndItemId(userId, 4);
                if (userXItemToDecrement.getAmount() > 0) {
                    userXItemToDecrement.setAmount(userXItemToDecrement.getAmount() - decrementBy);
                    userXItemRepository.save(userXItemToDecrement);
                } else {
                    break;
                }


                System.out.println("Course slots decremented for user with id: " + userId + " by " + decrementBy);

                break;
            }
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
