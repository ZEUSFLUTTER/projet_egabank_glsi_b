package com.ega.banque.repository;

import com.ega.banque.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCompteSourceIdAndDateTransactionBetween(
            Long compteId,
            LocalDateTime debut,
            LocalDateTime fin
    );

    List<Transaction> findByCompteDestinationIdAndDateTransactionBetween(
            Long compteId,
            LocalDateTime debut,
            LocalDateTime fin
    );

    List<Transaction> findByCompteSourceId(Long compteId);

    List<Transaction> findByCompteDestinationId(Long compteId);
}
