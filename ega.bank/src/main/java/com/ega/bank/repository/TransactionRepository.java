package com.ega.bank.repository;

import com.ega.bank.entity.Transaction;
import com.ega.bank.entity.Compte;
import com.ega.bank.entity.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByCompteOrderByDateTransactionDesc(Compte compte);
    
    List<Transaction> findByCompteIdOrderByDateTransactionDesc(Long compteId);
    
    @Query("SELECT t FROM Transaction t WHERE t.compte.id = :compteId " +
           "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndDateBetween(
        @Param("compteId") Long compteId,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
    
    @Query("SELECT t FROM Transaction t WHERE t.compte.id = :compteId " +
           "AND t.typeTransaction = :type " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndType(
        @Param("compteId") Long compteId,
        @Param("type") TypeTransaction type
    );
}