package com.preppath.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.preppath.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}

