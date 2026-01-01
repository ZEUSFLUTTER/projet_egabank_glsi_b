package com.ega.banking.repository;

import com.ega.banking.model.Transaction;
import com.ega.banking.model.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE (t.compteSource.id = :compteId OR t.compteDestination.id = :compteId) ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteId(@Param("compteId") Long compteId);

    @Query("SELECT t FROM Transaction t WHERE (t.compteSource.id = :compteId OR t.compteDestination.id = :compteId) " +
            "AND t.dateTransaction BETWEEN :dateDebut AND :dateFin ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteIdAndDateBetween(
            @Param("compteId") Long compteId,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin);

    List<Transaction> findByCompteSourceId(Long compteSourceId);

    List<Transaction> findByCompteDestinationId(Long compteDestinationId);

    List<Transaction> findByType(TypeTransaction type);

    @Query("SELECT t FROM Transaction t WHERE t.compteSource.id = :compteId AND t.type = :type ORDER BY t.dateTransaction DESC")
    List<Transaction> findByCompteSourceIdAndType(@Param("compteId") Long compteId,
            @Param("type") TypeTransaction type);
}
