package com.ega.repository;

import com.ega.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCourriel(String courriel);
    boolean existsByCourriel(String courriel);
}

