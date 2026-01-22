package com.iai.projet.banque.repository;

import com.iai.projet.banque.entity.Compte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {
    Compte  findByNumeroCompte(String numeroCompte);
    Compte findByIdClient(Long idClient);
    Compte findById(String idCompte);

}
