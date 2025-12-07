package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.UnitService;
import com.tengelyhatalmak.languaforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @GetMapping("/")
    public List<Unit> getALlUnits() {
        return unitService.findAllUnits();
    }

    @GetMapping("/{id}")
    public Unit getUnitById(@PathVariable Integer id) {
        return unitService.findUnitById(id);
    }


    @PostMapping("/createUnit")
    public Unit createUnit(@RequestBody Unit unit) {
        unit.setCreatedAt(Timestamp.valueOf(java.time.LocalDateTime.now()));
        return unitService.saveUnit(unit);
    }

    @PutMapping("/updateUnit/{id}")
    public Unit updateUnit(@RequestBody Unit unit, @PathVariable Integer id) {
        return unitService.updateUnit(unit, id);
    }

    @PatchMapping("/softDeleteUnit/{id}")
    public Unit softDeleteUnit(@PathVariable Integer id){
        Unit unit = unitService.findUnitById(id);
        unit.setIsDeleted(true);
        return unitService.saveUnit(unit);
    }

    @PatchMapping("/restoreUnit/{id}")
    public Unit restoreUnit(@PathVariable Integer id){
        Unit unit = unitService.findUnitById(id);
        unit.setIsDeleted(false);
        return unitService.saveUnit(unit);
    }

    @DeleteMapping("/hardDeleteUnit/{id}")
    public String hardDeleteUnit(@PathVariable Integer id) {
        unitService.deleteUnitById(id);
        return "Unit with id " + id + " has been deleted";
    }

}
