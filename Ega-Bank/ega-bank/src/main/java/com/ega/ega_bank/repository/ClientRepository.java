package com.ega.ega_bank.repository;

import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
  Optional<Client> findByCourriel(String courriel);
  
  // Méthode pour récupérer tous les clients avec un rôle spécifique
  List<Client> findByRole(Role role);
  
  // Méthode pour compter les clients par rôle
  long countByRole(Role role);
}
