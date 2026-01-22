package com.iai.projet.banque.repository;

import com.iai.projet.banque.entity.Operation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {

    List<Operation> findFirst5ByCompteSourceIdAndTypeOperationOrderByIdDesc(Long compteSourceId, String typeOperation);
        List<Operation> findAllByCompteSourceId(Long compteSourceId);

//    List<Operation> findByUsernameOrderByDateOprationDesc(String username);

    // Récupérer les transactions par username avec filtre de date
    @Query("SELECT o FROM Operation o " +
            "WHERE o.compteSourceId = :compteId " +
            "AND o.dateOperation <= :date " +
            "ORDER BY o.dateOperation DESC")
    List<Operation> findOperationsAvantDate(
            @Param("compteId") Long compteSourceId,
            @Param("date") LocalDate dateOperation
    );

}
