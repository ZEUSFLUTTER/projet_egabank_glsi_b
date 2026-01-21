/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Transaction;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author HP
 */
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("""
    select distinct t from Transaction t
    left join t.compteDestination cd
    where (
        t.compteSource.numeroCompte = :numeroCompte
        or cd.numeroCompte = :numeroCompte
    )
    and t.dateOperation between :dateDebut and :dateFin
    order by t.dateOperation desc
    """)
    List<Transaction> listerParPeriode(
            @Param("numeroCompte") String numeroCompte,
            @Param("dateDebut") LocalDateTime dateDebut,
            @Param("dateFin") LocalDateTime dateFin
    );
    
    @Query("""
    select distinct t from Transaction t
    join t.compteSource cs
    join cs.proprietaire cp
    left join t.compteDestination cd
    where cp.courriel = :courrielClient
    or (cd is not null and cd.proprietaire.courriel = :courrielClient)
    order by t.dateOperation desc
    """)
    List<Transaction> findByClientCourriel(@Param("courrielClient") String courrielClient);
    
    @Query("""
    select distinct t from Transaction t
    join t.compteSource cs
    join cs.proprietaire cp
    left join t.compteDestination cd
    where (cs.id = :compteId and cp.courriel = :courrielClient)
    or (cd is not null and cd.id = :compteId and cd.proprietaire.courriel = :courrielClient)
    order by t.dateOperation desc
    """)
    List<Transaction> findByCompteIdAndClientCourriel(@Param("compteId") Long compteId, @Param("courrielClient") String courrielClient);
    
    @Query("""
    select distinct t from Transaction t
    join t.compteSource cs
    join cs.proprietaire cp
    left join t.compteDestination cd
    where ((cs.id = :compteId and cp.courriel = :courrielClient)
    or (cd is not null and cd.id = :compteId and cd.proprietaire.courriel = :courrielClient))
    and t.dateOperation between :dateDebut and :dateFin
    order by t.dateOperation desc
    """)
    List<Transaction> findByCompteIdAndClientCourrielAndPeriode(
        @Param("compteId") Long compteId, 
        @Param("courrielClient") String courrielClient,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
}
