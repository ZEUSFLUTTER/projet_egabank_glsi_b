package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByNumeroCompte(String numeroCompte);

    // Nouvelle méthode pour lister les transactions d'un compte entre deux dates
    @Query("SELECT t FROM Transaction t " +
            "WHERE t.numeroCompte = :numeroCompte " +
            "AND t.dateTransaction BETWEEN :debut AND :fin")
    List<Transaction> listerParPeriode(
            @Param("numeroCompte") String numeroCompte,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin
    );
}
