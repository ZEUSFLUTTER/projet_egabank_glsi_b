package com.ega.banking.repository;

import com.ega.banking.model.CompteCourant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompteCourantRepository extends JpaRepository<CompteCourant, Long> {
}
