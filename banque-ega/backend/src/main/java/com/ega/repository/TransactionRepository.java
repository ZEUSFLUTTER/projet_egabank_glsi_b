package com.ega.repository;

import com.ega.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCompteIdOrderByDateTransactionDesc(Long compteId);
    
    @Query("SELECT t FROM Transaction t WHERE t.compte.id = :compteId " +
           "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndDateTransactionBetween(
            @Param("compteId") Long compteId,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin
    );
    
    List<Transaction> findByCompteClientId(Long clientId);
}

