package com.bank.ega.repository;

import com.bank.ega.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Transactions d'un compte (source ou destination) sur une période
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.compteSource.id = :compteId OR t.compteDestination.id = :compteId) " +
           "AND t.dateTransaction BETWEEN :debut AND :fin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndDateTransactionBetween(
            @Param("compteId") Long compteId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin
    );

    // Toutes les transactions d'un compte
    @Query("SELECT t FROM Transaction t WHERE " +
           "t.compteSource.id = :compteId OR t.compteDestination.id = :compteId " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteId(@Param("compteId") Long compteId);

    // Transactions par numéro de compte
    @Query("SELECT t FROM Transaction t WHERE " +
           "t.compteSource.numeroCompte = :numeroCompte OR t.compteDestination.numeroCompte = :numeroCompte " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByNumeroCompte(@Param("numeroCompte") String numeroCompte);

    // Transactions par numéro de compte sur une période
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.compteSource.numeroCompte = :numeroCompte OR t.compteDestination.numeroCompte = :numeroCompte) " +
           "AND t.dateTransaction BETWEEN :debut AND :fin " +
           "ORDER BY t.dateTransaction DESC")
    List<Transaction> findByNumeroCompteAndDateTransactionBetween(
            @Param("numeroCompte") String numeroCompte,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin
    );

    // Toutes les transactions (pour admin)
    @Query("SELECT t FROM Transaction t ORDER BY t.dateTransaction DESC")
    List<Transaction> findAllOrderByDateDesc();
}
