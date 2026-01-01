package com.ega.banking.repository;

import com.ega.banking.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    boolean existsByTelephone(String telephone);
    
    Optional<Client> findByTelephone(String telephone);
}
