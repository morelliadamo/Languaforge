package com.tengelyhatalmak.languaforge.service;

import com.tengelyhatalmak.languaforge.model.Role;
import com.tengelyhatalmak.languaforge.model.User;
import com.tengelyhatalmak.languaforge.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RoleServiceImpl implements RoleService{

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> findAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role findRoleById(Integer id) {
        return roleRepository.findById(id).orElseThrow(()-> new RuntimeException("Role not found"));
    }

    @Override
    public Role updateRole(Role role, Integer id) {
        Role existingRole = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        existingRole.setName(role.getName());
        existingRole.setDescription(role.getDescription());
        return roleRepository.save(existingRole);
    }

    @Override
    public Role softDeleteRole( Integer id) {
        Role roleToSoftDelete = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));

        roleToSoftDelete.setIsDeleted(true);
        roleToSoftDelete.setDeletedAt(Timestamp.valueOf(LocalDateTime.now()));

        return roleRepository.save(roleToSoftDelete);
    }

    @Override
    public Role restoreRole(Integer id) {
        Role roleToRestore = roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
        roleToRestore.setIsDeleted(false);
        return roleRepository.save(roleToRestore);
    }

    @Override
    public List<User> getAllUsersByRoleId(Integer roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"))
                .getUsers();
    }

    @Override
    public void deleteRoleById(Integer id) {
        System.out.println("Deleting role with id: " + id);
        roleRepository.deleteById(id);
    }
}
