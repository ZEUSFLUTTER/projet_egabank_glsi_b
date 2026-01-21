/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Compte;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author HP
 */
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    boolean existsByNumeroCompte(String numeroCompte);
    List<Compte> findByProprietaireCourriel(String courriel);
    Optional<Compte> findByIdAndProprietaireCourriel(Long id, String courriel);
}
