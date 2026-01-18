package com.iai.ega_bank.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
import com.iai.ega_bank.entities.Operation;

import jakarta.transaction.Transactional;

@Transactional
public interface OperationRepository extends JpaRepository<Operation, Long>{

}
