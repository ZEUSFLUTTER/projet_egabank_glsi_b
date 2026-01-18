package com.iai.ega_bank.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iai.ega_bank.entities.Client;

import jakarta.transaction.Transactional;


@Repository
@Transactional

public interface ClientRepository extends JpaRepository<Client, Long>{


}
