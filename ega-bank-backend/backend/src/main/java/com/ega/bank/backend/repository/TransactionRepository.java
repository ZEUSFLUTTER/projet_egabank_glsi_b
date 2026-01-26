package com.ega.bank.backend.repository;

import com.ega.bank.backend.entity.Transaction;
import com.ega.bank.backend.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCompteSource(Compte compte);

    List<Transaction> findByCompteSourceAndDateTransactionBetween(
            Compte compte,
            LocalDateTime dateDebut,
            LocalDateTime dateFin);

    @Query("SELECT COUNT(t) FROM Transaction t")
    long countAllTransactions();

    @Query("SELECT COALESCE(SUM(t.montant), 0) FROM Transaction t")
    BigDecimal sumAllTransactionAmounts();
}