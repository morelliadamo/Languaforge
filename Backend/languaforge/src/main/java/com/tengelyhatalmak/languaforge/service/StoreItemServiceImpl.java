package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.StoreItem;
import com.tengelyhatalmak.languaforge.repository.StoreItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreItemServiceImpl implements StoreItemService{

    @Autowired
    private StoreItemRepository storeItemRepository;

    @Override
    public StoreItem saveStoreItem(StoreItem storeItem) {
        return storeItemRepository.save(storeItem);
    }

    @Override
    public StoreItem findStoreItemById(Integer id) {
        return storeItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StoreItem not found"));
    }

    @Override
    public List<StoreItem> findAllStoreItems() {
        return storeItemRepository.findAll();
    }

    @Override
    public StoreItem updateStoreItem(StoreItem storeItem, Integer id) {
        StoreItem storeItemToUpdate = storeItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StoreItem not found"));

        storeItemToUpdate.setName(storeItem.getName());
        storeItemToUpdate.setDescription(storeItem.getDescription());
        storeItemToUpdate.setPrice(storeItem.getPrice());
        storeItemToUpdate.setType(storeItem.getType());

        return storeItemRepository.save(storeItemToUpdate);
    }

    @Override
    public String deleteStoreItemById(Integer id) {
        storeItemRepository.deleteById(id);

        return "StoreItem with id: " + id + " has been deleted.";
    }
}
