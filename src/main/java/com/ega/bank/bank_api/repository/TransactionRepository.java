package com.ega.bank.bank_api.repository;

import com.ega.bank.bank_api.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository pour l'entité Transaction
 * Conforme au cahier des charges pour les opérations bancaires
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Trouver toutes les transactions d'un compte par numéro de compte
     * Triées par date décroissante (plus récentes en premier)
     */
    @Query("SELECT t FROM Transaction t WHERE t.compte.numeroCompte = :numeroCompte ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteNumeroCompteOrderByDateTransactionDesc(@Param("numeroCompte") String numeroCompte);
    
    /**
     * Trouver les transactions d'un compte pour une période donnée
     */
    @Query("SELECT t FROM Transaction t WHERE t.compte.numeroCompte = :numeroCompte " +
           "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByNumeroCompteAndDateTransactionBetween(
            @Param("numeroCompte") String numeroCompte,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin);
    
    /**
     * Trouver toutes les transactions d'un compte par ID
     */
    List<Transaction> findByCompteIdOrderByDateTransactionDesc(Long compteId);
    
    /**
     * Trouver les transactions par type
     */
    List<Transaction> findByTypeTransactionOrderByDateTransactionDesc(Transaction.TypeTransaction typeTransaction);
    
    /**
     * Trouver les transactions d'un propriétaire de compte
     */
    @Query("SELECT t FROM Transaction t WHERE t.compte.proprietaire.id = :proprietaireId ORDER BY t.dateTransaction DESC")
    List<Transaction> findByProprietaireIdOrderByDateTransactionDesc(@Param("proprietaireId") Long proprietaireId);
    
    /**
     * Compter le nombre de transactions d'un compte
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.compte.numeroCompte = :numeroCompte")
    Long countByCompteNumeroCompte(@Param("numeroCompte") String numeroCompte);
    
    /**
     * Trouver les dernières transactions d'un compte (limite)
     */
    @Query("SELECT t FROM Transaction t WHERE t.compte.numeroCompte = :numeroCompte " +
           "ORDER BY t.dateTransaction DESC LIMIT :limit")
    List<Transaction> findTopByCompteNumeroCompteOrderByDateTransactionDesc(
            @Param("numeroCompte") String numeroCompte, 
            @Param("limit") int limit);
}