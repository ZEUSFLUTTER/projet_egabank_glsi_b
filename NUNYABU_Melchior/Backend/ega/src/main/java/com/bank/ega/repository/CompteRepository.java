package com.bank.ega.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.ega.entity.Compte;

import java.util.Optional;
import java.util.List;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {

    Optional<Compte> findByNumeroCompte(String numeroCompte);

    List<Compte> findByClientId(Long clientId);
}
