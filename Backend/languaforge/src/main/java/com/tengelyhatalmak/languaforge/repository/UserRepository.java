package com.tengelyhatalmak.languaforge.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tengelyhatalmak.languaforge.model.User;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Procedure("get_user_by_username")
    Optional<User> getUserByUsername(String username);


    @Procedure("get_user_by_email")
    Optional<User> getUserByEmail(String email);

    User findByActivationToken(String activationToken);
}
