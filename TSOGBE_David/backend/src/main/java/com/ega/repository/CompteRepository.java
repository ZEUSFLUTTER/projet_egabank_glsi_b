package com.ega.repository;

import com.ega.model.Compte;
import com.ega.model.TypeCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    boolean existsByNumeroCompte(String numeroCompte);
    List<Compte> findByClientId(Long clientId);
    List<Compte> findByClientIdAndTypeCompte(Long clientId, TypeCompte typeCompte);
}

