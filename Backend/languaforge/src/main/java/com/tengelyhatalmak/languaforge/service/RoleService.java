package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Role;
import com.tengelyhatalmak.languaforge.model.Unit;
import com.tengelyhatalmak.languaforge.model.User;

import java.util.List;

public interface RoleService {
    Role saveRole(Role role);
    List<Role> findAllRoles();
    Role findRoleById(Integer id);
    Role updateRole(Role role, Integer id);
    Role softDeleteRole(Integer id);
    Role restoreRole( Integer id);
    List<User> getAllUsersByRoleId(Integer roleId);
    void deleteRoleById(Integer id);
}
