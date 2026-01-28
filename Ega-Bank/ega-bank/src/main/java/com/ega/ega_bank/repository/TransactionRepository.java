package com.ega.ega_bank.repository;

import com.ega.ega_bank.entite.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Historique par compte et période
    @Query("select t from Transaction t " +
            "where (t.compteSource.id = :compteId or t.compteDestination.id = :compteId) " +
            "and t.dateOperation between :debut and :fin " +
            "order by t.dateOperation desc")
    List<Transaction> findByCompteAndPeriode(Long compteId, LocalDateTime debut, LocalDateTime fin);

    // Historique par client (toutes ses transactions)
    List<Transaction> findByClientIdOrderByDateOperationDesc(Long clientId);

    // Transactions récentes (pour dashboard admin)
    List<Transaction> findAllByOrderByDateOperationDesc(Pageable pageable);

    // Historique par client et période
    @Query("select t from Transaction t " +
            "where t.client.id = :clientId " +
            "and t.dateOperation between :debut and :fin " +
            "order by t.dateOperation desc")
    List<Transaction> findByClientAndPeriode(Long clientId, LocalDateTime debut, LocalDateTime fin);
}
