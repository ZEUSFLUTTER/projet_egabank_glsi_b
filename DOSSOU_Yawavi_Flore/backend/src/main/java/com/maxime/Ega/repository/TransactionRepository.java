package com.maxime.Ega.repository;

import com.maxime.Ega.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_AccountNumberAndTransactionDateBetween(
            String accountNumber,
            LocalDateTime dateDebut,
            LocalDateTime dateFin
    );


}
