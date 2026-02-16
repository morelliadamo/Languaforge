package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Pricing;
import com.tengelyhatalmak.languaforge.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pricings")
public class PricingController {

    @Autowired
    private PricingService pricingService;


    @GetMapping("/")
    public List<Pricing> getAllPricings(){
        return pricingService.findAllPricings();
    }

    @GetMapping("/{id}")
    public Pricing getPricingById(@PathVariable Integer id){
        return pricingService.findPricingById(id);
    }

    @PostMapping("createPricing")
    public Pricing createPricing(@RequestBody Pricing pricing){
        return pricingService.savePricing(pricing);
    }

    @PatchMapping("/softDeletePricing/{id}")
    public Pricing softDeletePricing(@PathVariable Integer id){
        return pricingService.softDeletePricing(id);
    }

    @PutMapping("/updatePricing/{id}")
    public Pricing updatePricing(@RequestBody Pricing pricing, @PathVariable Integer id){
        return pricingService.updatePricing(pricing, id);
    }

    @DeleteMapping("/hardDeletePricing/{id}")
    public void hardDeletePricing(@PathVariable Integer id){
        pricingService.hardDeletePricingById(id);
    }
}
