package com.egabank.Backend.repository;

import com.egabank.Backend.entity.Releve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReleveRepository extends JpaRepository<Releve, Long> {
    List<Releve> findByNumeroCompte(String numeroCompte);
}