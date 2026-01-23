package com.maxime.Ega.repository;

import com.maxime.Ega.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByCodeClient(String codeClient);
    List<Client> findAllByDeletedTrue();
    List<Client> findAllByDeletedFalse();

}
