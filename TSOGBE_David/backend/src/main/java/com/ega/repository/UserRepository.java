package com.ega.repository;

import com.ega.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"client"})
    Optional<User> findByCourriel(String courriel);
    boolean existsByCourriel(String courriel);
}

