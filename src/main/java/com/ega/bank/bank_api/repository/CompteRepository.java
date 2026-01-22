package com.ega.bank.bank_api.repository;

import com.ega.bank.bank_api.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    
    boolean existsByNumeroCompte(String numeroCompte);
    
    List<Compte> findByProprietaireId(Long proprietaireId);
    
    @Query("SELECT c FROM Compte c WHERE c.proprietaire.id = :proprietaireId AND c.typeCompte = :typeCompte")
    List<Compte> findByProprietaireIdAndTypeCompte(@Param("proprietaireId") Long proprietaireId, 
                                                   @Param("typeCompte") Compte.TypeCompte typeCompte);
    
    @Query("SELECT c FROM Compte c JOIN FETCH c.proprietaire WHERE c.numeroCompte = :numeroCompte")
    Optional<Compte> findByNumeroCompteWithProprietaire(@Param("numeroCompte") String numeroCompte);
}