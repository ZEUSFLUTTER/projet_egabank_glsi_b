package com.ega.banque.repository;

import com.ega.banque.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByUsername(String username);
    Optional<Client> findByUsernameOrEmail(String username, String email);
}
