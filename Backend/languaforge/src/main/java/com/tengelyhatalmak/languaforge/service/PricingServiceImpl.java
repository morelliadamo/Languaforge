package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Pricing;
import com.tengelyhatalmak.languaforge.repository.PricingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PricingServiceImpl implements PricingService{

    @Autowired
    private PricingRepository pricingRepository;


    @Override
    public Pricing savePricing(Pricing pricing) {
        return pricingRepository.save(pricing);
    }

    @Override
    public List<Pricing> findAllPricings() {
        return pricingRepository.findAll();
    }

    @Override
    public Pricing findPricingById(Integer id) {
        return pricingRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Pricing not found"));
    }

    @Override
    public Pricing updatePricing(Pricing pricing, Integer id) {
        Pricing existingPricing = pricingRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Pricing not found"));

        existingPricing.setPrice(pricing.getPrice());
        existingPricing.setBillingCycle(pricing.getBillingCycle());
        existingPricing.setName(pricing.getName());

        return pricingRepository.save(existingPricing);
    }

    @Override
    public Pricing softDeletePricing(Integer id) {
        Pricing pricingToSoftDelete = pricingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));


        pricingToSoftDelete.setIsDeleted(true);
        pricingToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return pricingRepository.save(pricingToSoftDelete);
    }

    @Override
    public void hardDeletePricingById(Integer id) {
        System.out.println("Deleting pricing with id: " + id);

        pricingRepository.deleteById(id);

    }
}
