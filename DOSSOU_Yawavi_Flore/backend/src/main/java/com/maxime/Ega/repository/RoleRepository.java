package com.maxime.Ega.repository;

import com.maxime.Ega.entity.Role;
import com.maxime.Ega.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    List<Role> findAll();

    Optional<Role> findByLabel(RoleType label);

//    Optional<Role> roleAgent = roleRepository.findByLibelle(AGENT.name());
//            roleAgent.ifPresent(inscriptionAgent::setRole);
}
