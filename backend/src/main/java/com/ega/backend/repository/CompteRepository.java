package com.ega.backend.repository;

import com.ega.backend.model.Compte;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompteRepository extends MongoRepository<Compte, String> {
    List<Compte> findByClientId(String clientId);

    // Méthode pour compter les comptes actifs
    long countByIsActiveTrue();

    // Méthode pour compter les comptes inactifs
    long countByIsActiveFalse();

    // Méthode pour trouver les comptes actifs
    List<Compte> findByIsActiveTrue();

    // Ajoute d'autres méthodes personnalisées si nécessaire
}