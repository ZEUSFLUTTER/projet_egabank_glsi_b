package com.ega.bank.bank_api.repository;

import com.ega.bank.bank_api.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    Optional<Client> findByCourriel(String courriel);
    
    Optional<Client> findByNumeroTelephone(String numeroTelephone);
    
    boolean existsByCourriel(String courriel);
    
    boolean existsByNumeroTelephone(String numeroTelephone);
    
    @Query("SELECT c FROM Client c WHERE " +
           "LOWER(c.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.courriel) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Client> findBySearchTerm(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT c FROM Client c WHERE c.nationalite = :nationalite")
    List<Client> findByNationalite(@Param("nationalite") String nationalite);
}