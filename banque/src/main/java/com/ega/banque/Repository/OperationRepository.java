package com.ega.banque.Repository;

import com.ega.banque.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OperationRepository extends JpaRepository<Transaction, Long> {

    /**
     * Cette méthode permet de récupérer toutes les transactions d'un client
     * (Adaptation pour correspondre au champ clientId de la classe Transaction).
     */
    List<Transaction> findByClientId(Long clientId);

   
    List<Transaction> findByType(String type);
    

}