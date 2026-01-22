package com.maxime.Ega.repository;

import com.maxime.Ega.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByMatricule(String matricule);
}
