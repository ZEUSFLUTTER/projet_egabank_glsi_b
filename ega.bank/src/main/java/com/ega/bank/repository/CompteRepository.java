package com.ega.bank.repository;

import com.ega.bank.entity.Compte;
import com.ega.bank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    List<Compte> findByProprietaire(Client proprietaire);
    List<Compte> findByProprietaireId(Long clientId);
    boolean existsByNumeroCompte(String numeroCompte);
}