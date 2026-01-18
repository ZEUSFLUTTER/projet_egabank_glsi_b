package com.iai.ega_bank.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.iai.ega_bank.entities.CompteBancaire;

import java.util.Optional;
// import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

@Repository
@Transactional
public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
Optional<CompteBancaire> findByNumCompte(String numCompte);

}
