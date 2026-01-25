package com.ega.backend.repository;

import com.ega.backend.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends MongoRepository<Client, String> {
    Optional<Client> findByEmail(String email);

    // ✅ Nouvelle méthode : Trouver les clients par rôle
    List<Client> findByRole(String role);

    // Méthode pour compter les clients avec un statut KYC spécifique
    long countByStatutKYC(String statutKYC);

    // Ajoute d'autres méthodes personnalisées si nécessaire
}