package com.iai.projet.banque.repository;

import com.iai.projet.banque.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    String findByName(String name);
}
