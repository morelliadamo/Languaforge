package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Pricing;
import com.tengelyhatalmak.languaforge.model.Review;

import java.util.List;

public interface PricingService {

    Pricing savePricing(Pricing pricing);
    List<Pricing> findAllPricings();
    Pricing findPricingById(Integer id);

    Pricing updatePricing(Pricing pricing, Integer id);

    Pricing softDeletePricing(Integer id);
    void hardDeletePricingById(Integer id);



}
