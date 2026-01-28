package com.ega.ega_bank.repository;

import com.ega.ega_bank.entite.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);

    // Pour l’admin : récupérer les comptes par ID du client
    List<Compte> findByProprietaireId(Long clientId);

    // Pour le client connecté : récupérer les comptes par email du propriétaire (insensible à la casse)
    List<Compte> findByProprietaireCourrielIgnoreCase(String courriel);
}
