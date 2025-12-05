package com.tengelyhatalmak.languaforge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tengelyhatalmak.languaforge.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {}
