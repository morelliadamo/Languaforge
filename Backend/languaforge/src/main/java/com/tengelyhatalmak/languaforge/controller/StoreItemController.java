package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.StoreItem;
import com.tengelyhatalmak.languaforge.service.StoreItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/storeItems")
public class StoreItemController {

    @Autowired
    private StoreItemService storeItemService;


    @GetMapping("/")
    public List<StoreItem> getAllStoreItems() {
        return storeItemService.findAllStoreItems();
    }

    @GetMapping("/{id}")
    public StoreItem getStoreItemById(@PathVariable Integer id) {
        return storeItemService.findStoreItemById(id);
    }

    @PostMapping("/createStoreItem")
    public StoreItem createStoreItem(@RequestBody StoreItem storeItem) {
        return storeItemService.saveStoreItem(storeItem);
    }

    @PutMapping("/updateStoreItem/{id}")
    public StoreItem updateStoreItem(@RequestBody StoreItem storeItem, @PathVariable Integer id) {
        return storeItemService.updateStoreItem(storeItem, id);
    }

    @DeleteMapping("/deleteStoreItem/{id}")
    public String deleteStoreItem(@PathVariable Integer id) {
        return storeItemService.deleteStoreItemById(id);
    }
}
