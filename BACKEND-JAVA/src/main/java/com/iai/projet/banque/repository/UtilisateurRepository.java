package com.iai.projet.banque.repository;

import com.iai.projet.banque.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur,Long> {
    Optional<Utilisateur>findByUsername(String username);

    Optional<Utilisateur> findByEmail(String email);
}
