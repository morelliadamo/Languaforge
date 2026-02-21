package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.StoreItem;

import java.util.List;

public interface StoreItemService {
    StoreItem saveStoreItem(StoreItem storeItem);

    StoreItem findStoreItemById(Integer id);
    List<StoreItem> findAllStoreItems();

    StoreItem updateStoreItem(StoreItem storeItem, Integer id);

    String deleteStoreItemById(Integer id);


}
