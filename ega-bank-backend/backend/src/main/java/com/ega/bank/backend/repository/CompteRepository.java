package com.ega.bank.backend.repository;

import com.ega.bank.backend.entity.Compte;
import com.ega.bank.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CompteRepository extends JpaRepository<Compte, Long> {

    Optional<Compte> findByNumeroCompte(String numeroCompte);

    List<Compte> findByClient(Client client);

    @Query("SELECT COALESCE(SUM(c.solde), 0) FROM Compte c")
    BigDecimal sumAllSoldes();
}