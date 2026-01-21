package com.ega.banque.Repository;

import com.ega.banque.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    /**
     * Cette méthode permet à Spring Data JPA de générer automatiquement 
     * une requête SQL : SELECT * FROM Client WHERE numero_compte = ?
     */
    Optional<Client> findByNumeroCompte(String numeroCompte);
}