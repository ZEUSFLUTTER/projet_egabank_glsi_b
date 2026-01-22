package com.bank.ega.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.bank.ega.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
	Optional<Client> findByEmail(String email);

	com.bank.ega.entity.Client save(com.bank.ega.entity.Client client);

	List<com.bank.ega.entity.Client> findAll();

	void deleteById(Long id);
	

	

}
