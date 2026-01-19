package com.egabank.back.repository;

import com.egabank.back.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal; // AJOUTER CET IMPORT
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByNumeroCompte(String numeroCompte);
    List<Account> findByClientId(Long clientId);
    List<Account> findByClientIdAndActifTrue(Long clientId);
    
    // Utilisation de la vue v_comptes_actifs
    @Query(value = "SELECT * FROM v_comptes_actifs WHERE client_id = :clientId", nativeQuery = true)
    List<Object[]> findActiveAccountsByClientId(@Param("clientId") Long clientId);
    
    // Solde total client (vue v_solde_client)
    @Query(value = "SELECT solde_total FROM v_solde_client WHERE client_id = :clientId", nativeQuery = true)
    BigDecimal getTotalSoldeByClientId(@Param("clientId") Long clientId);
}