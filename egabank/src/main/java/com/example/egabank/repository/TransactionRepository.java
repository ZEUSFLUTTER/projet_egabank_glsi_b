package com.example.egabank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.example.egabank.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.compteSource.proprietaire.id = :clientId OR t.compteDestination.proprietaire.id = :clientId ORDER BY t.dateTransaction DESC")
    List<Transaction> findByClientId(@Param("clientId") Long clientId);
    
    @Query("SELECT t FROM Transaction t WHERE t.compteSource.id = :compteId OR t.compteDestination.id = :compteId ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteId(@Param("compteId") Long compteId);
    
    // Nouvelles méthodes pour l'admin
    List<Transaction> findAllByOrderByDateTransactionDesc();
    
    List<Transaction> findTop10ByOrderByDateTransactionDesc();
    
    // Requêtes avec détails complets
    @Query("SELECT t FROM Transaction t " +
           "LEFT JOIN FETCH t.compteSource cs " +
           "LEFT JOIN FETCH cs.proprietaire " +
           "LEFT JOIN FETCH t.compteDestination cd " +
           "LEFT JOIN FETCH cd.proprietaire " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findAllWithDetails();
    
    @Query("SELECT t FROM Transaction t " +
           "LEFT JOIN FETCH t.compteSource cs " +
           "LEFT JOIN FETCH cs.proprietaire " +
           "LEFT JOIN FETCH t.compteDestination cd " +
           "LEFT JOIN FETCH cd.proprietaire " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findTop10WithDetails();
}