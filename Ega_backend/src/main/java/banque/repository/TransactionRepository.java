package banque.repository;

import banque.entity.Compte;
import banque.entity.Transaction;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.*;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByRefTransaction(String refTransaction);
//    @Query("SELECT t FROM Transaction t WHERE t.compteSource.numeroCompte = :numero OR t.compteDestination.numeroCompte = :numero ORDER BY t.dateTransaction DESC")
@Query("SELECT t FROM Transaction t " +
        "LEFT JOIN t.compteSource cs " +
        "LEFT JOIN t.compteDestination cd " +
        "WHERE cs.numeroCompte = :numero OR cd.numeroCompte = :numero " +
        "ORDER BY t.dateTransaction DESC")
    List<Transaction> findHistoriqueByCompte(@Param("numero") String numeroCompte);


    List<Transaction> findByCompteSourceOrCompteDestinationAndDateTransactionBetweenOrderByDateTransactionDesc(Compte compte, Compte compte1, LocalDateTime dateDebut, LocalDateTime dateFin);
}
