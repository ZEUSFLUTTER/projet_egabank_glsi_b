package com.ega.banking.repository;

import com.ega.banking.model.CompteEpargne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompteEpargneRepository extends JpaRepository<CompteEpargne, Long> {
}
