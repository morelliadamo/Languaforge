package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.model.User;

import java.util.List;

public interface UnitService {
    Unit saveUnit(Unit unit);
    List<Unit> findAllUnits();
    Unit findUnitById(Integer id);
    Unit updateUnit(Unit unit, Integer id);
    void deleteUnitById(Integer id);
    void deleteUnitsByCourseId(Integer courseId);
}
