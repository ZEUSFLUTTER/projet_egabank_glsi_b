package com.ega.bank.backend.repository;

import com.ega.bank.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {

    Optional<Client> findByCourriel(String courriel);

    boolean existsByCourriel(String courriel);
}