/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Client;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

/**
 *
 * @author HP
 */
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCourriel(String courriel);
    boolean existsByCourriel(String courriel);
    boolean existsByNumeroTelephone(String numeroTelephone);
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Compte c WHERE c.proprietaire.id = :clientId")
    boolean aDesComptes(@Param("clientId") Long clientId);
    
    @Query("SELECT cl FROM Client cl WHERE NOT EXISTS (SELECT c FROM Compte c WHERE c.proprietaire = cl)")
    List<Client> findClientsSansComptes();
}
