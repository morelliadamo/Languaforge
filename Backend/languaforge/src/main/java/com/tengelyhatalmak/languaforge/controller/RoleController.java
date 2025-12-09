package com.tengelyhatalmak.languaforge.controller;

import com.tengelyhatalmak.languaforge.model.Role;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.service.RoleService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;


    @GetMapping("/")
    public List<Role> getAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/{id}")
    public Role getRoleById(@PathVariable Integer id) {
        return roleService.findRoleById(id);
    }

    @GetMapping("/{id}/users")
    public List<User> getAllUsersByRoleId(@PathVariable Integer id) {
        return roleService.getAllUsersByRoleId(id);
    }

    @PostMapping("/createRole")
    public Role createRole(@RequestBody Role role) {
        return roleService.saveRole(role);
    }

    @PutMapping("/updateRole/{id}")
    public Role updateRole(@RequestBody Role role, @PathVariable Integer id) {
        return roleService.updateRole(role, id);
    }

    @PatchMapping("/softDeleteRole/{id}")
    public Role softDeleteRole(@PathVariable Integer id) {
        return roleService.softDeleteRole(id);
    }

    @PatchMapping("/restoreRole/{id}")
    public Role restoreRole(@PathVariable Integer id) {
        return roleService.restoreRole(id);
    }

}
