package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.UserXItem;
import com.tengelyhatalmak.languaforge.service.UserXItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userXitems")
public class UserXItemController {

    @Autowired
    private UserXItemService userXItemService;

    @GetMapping("/")
    public List<UserXItem> getAllUserXItems(){
        return userXItemService.findAllUserXItems();
    }

    @GetMapping("/{id}")
    public UserXItem getUserXItemById(@PathVariable Integer id){
        return userXItemService.findUserXItemById(id);
    }

    @GetMapping("/user/{userId}")
    public List<UserXItem> getUserXItemsByUserId(@PathVariable Integer userId){
        return userXItemService.findUserXItemsByUserId(userId);
    }

    @PostMapping("/createUserXItem")
    public UserXItem createUserXItem(@RequestBody UserXItem userXItem){
        return userXItemService.saveUserXItem(userXItem);
    }

    @PutMapping("/updateUserXItem/{id}")
    public UserXItem updateUserXItem(@RequestBody UserXItem userXItem, @PathVariable Integer id){
        return userXItemService.updateUserXItem(userXItem, id);
    }

    @DeleteMapping("/deleteUserXItem/{id}")
    public String deleteUserXItem(@PathVariable Integer id){
    return userXItemService.deleteUserXItemById(id);
    }




}
