package com.egabank.back.repository;

import com.egabank.back.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Transactions d'un compte sur une période
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.compteSource.id = :accountId OR t.compteDestination.id = :accountId) " +
           "AND t.dateTransaction BETWEEN :startDate AND :endDate " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByAccountAndPeriod(
            @Param("accountId") Long accountId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    // Utilisation de la vue v_transactions_detail
    @Query(value = "SELECT * FROM v_transactions_detail WHERE compte_source = :accountNumber OR compte_destination = :accountNumber", 
           nativeQuery = true)
    List<Object[]> findTransactionsByAccountNumber(@Param("accountNumber") String accountNumber);
    
    // Relevé de compte (vue v_releve_compte)
    @Query(value = "SELECT * FROM v_releve_compte WHERE compte_id = :accountId " +
                   "AND date_transaction BETWEEN :startDate AND :endDate " +
                   "ORDER BY date_transaction DESC", 
           nativeQuery = true)
    List<Object[]> getReleveCompte(
            @Param("accountId") Long accountId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);
}