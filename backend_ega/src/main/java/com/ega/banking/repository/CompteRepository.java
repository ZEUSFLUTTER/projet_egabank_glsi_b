package com.ega.banking.repository;

import com.ega.banking.model.Compte;
import com.ega.banking.model.TypeCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {

    Optional<Compte> findByNumeroCompte(String numeroCompte);

    boolean existsByNumeroCompte(String numeroCompte);

    List<Compte> findByClientId(Long clientId);

    List<Compte> findByType(TypeCompte type);

    @Query("SELECT c FROM Compte c WHERE c.client.id = :clientId AND c.type = :type")
    List<Compte> findByClientIdAndType(@Param("clientId") Long clientId, @Param("type") TypeCompte type);

    long countByClientId(Long clientId);
}
