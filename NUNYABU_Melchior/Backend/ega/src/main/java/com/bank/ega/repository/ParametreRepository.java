package com.bank.ega.repository;

import com.bank.ega.entity.Parametre;
import com.bank.ega.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParametreRepository extends JpaRepository<Parametre, Long> {
    List<Parametre> findByUtilisateur(Utilisateur utilisateur);
    Optional<Parametre> findByUtilisateurAndCle(Utilisateur utilisateur, String cle);
}
