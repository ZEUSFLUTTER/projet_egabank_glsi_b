package com.egabank.back.repository;

import com.egabank.back.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
    Optional<Client> findByUserId(Long userId);
    
    // Utilisation de la vue v_clients_comptes via query native
    @Query(value = "SELECT * FROM v_clients_comptes WHERE client_id = :clientId", nativeQuery = true)
    List<Object[]> findClientWithAccounts(@Param("clientId") Long clientId);
}