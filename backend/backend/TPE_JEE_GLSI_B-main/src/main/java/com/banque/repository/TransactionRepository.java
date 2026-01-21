package com.banque.repository;

import com.banque.entity.Transaction;
import com.banque.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByCompteSource(Compte compte);
    
    List<Transaction> findByCompteDestination(Compte compte);
    
    List<Transaction> findByCompteSourceOrCompteDestination(Compte compteSource, Compte compteDestination);
    
    @Query("SELECT t FROM Transaction t WHERE (t.compteSource = :compte OR t.compteDestination = :compte) " +
           "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteAndDateBetween(
        @Param("compte") Compte compte,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
}

