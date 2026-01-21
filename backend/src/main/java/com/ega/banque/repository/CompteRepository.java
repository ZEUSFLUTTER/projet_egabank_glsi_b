package com.ega.banque.repository;

import com.ega.banque.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompteRepository extends JpaRepository<Compte, Long> {

    List<Compte> findByClientId(Long clientId);

    Compte findByNumeroCompte(String numeroCompte);
}
