package com.tengelyhatalmak.languaforge.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.repository.UnitRepository;

@Service
public class UnitServiceImpl implements UnitService{

    @Autowired
    private UnitRepository unitRepository;

    @Override
    public Unit saveUnit(Unit unit) {
        return unitRepository.save(unit);
    }

    @Override
    public List<Unit> findAllUnits() {
        return unitRepository.findAll();
    }

    @Override
    public Unit findUnitById(Integer id) {
        return unitRepository.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
    }

    @Override
    public Unit updateUnit(Unit unit, Integer id) {
        Unit existingUnit = unitRepository.findById(id).orElseThrow(() -> new RuntimeException("Unit not found"));
        if(unit.getTitle() != null) {
            existingUnit.setTitle(unit.getTitle());
        }
        if(unit.getOrderIndex() != null) {
            existingUnit.setOrderIndex(unit.getOrderIndex());
        }
        return unitRepository.save(existingUnit);
    }

    @Override
    public Unit softDeleteUnit(Integer id) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));

        unit.setIsDeleted(true);
        unit.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

            unit.getLessons().forEach(lesson -> {
                lesson.setIsDeleted(true);
                lesson.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
                    lesson.getExercises().forEach(exercise -> {
                        exercise.setIsDeleted(true);
                        exercise.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));
                    });
                });


        return unitRepository.save(unit);
    }


    @Override
    public Unit restoreUnit(Integer id) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));

        unit.setIsDeleted(false);
        unit.setDeletedAt(null);


        unit.getLessons().forEach(lesson -> {
            lesson.setIsDeleted(false);
            lesson.setDeletedAt(null);
                lesson.getExercises().forEach(exercise -> {
                    exercise.setIsDeleted(false);
                    exercise.setDeletedAt(null);
                });
            });

        return unitRepository.save(unit);
    }

    @Override
    public void deleteUnitById(Integer id) {
        System.out.println("Deleting unit with id: " + id);
        unitRepository.deleteById(id);
    }

    @Override
    public void deleteUnitsByCourseId(Integer courseId) {
        List<Unit> unitsToDelete = unitRepository.findAll().stream()
                .filter(unit -> unit.getCourse().getId().equals(courseId))
                .toList();

        unitRepository.deleteAll(unitsToDelete);
    }


}
