package com.example.egabank.repository;
import com.example.egabank.entity.Compte;
import com.example.egabank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    List<Compte> findByProprietaire(Client proprietaire);
}