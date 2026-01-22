package com.ega.bank.bank_api.repository;

import com.ega.bank.bank_api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité User
 * Conforme au cahier des charges pour l'authentification
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Trouver un utilisateur par nom d'utilisateur
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Trouver un utilisateur par email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Vérifier si un nom d'utilisateur existe
     */
    boolean existsByUsername(String username);
    
    /**
     * Vérifier si un email existe
     */
    boolean existsByEmail(String email);
    
    /**
     * Trouver les utilisateurs par rôle
     */
    List<User> findByRole(User.Role role);
    
    /**
     * Trouver un utilisateur avec son client associé
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.client WHERE u.username = :username")
    Optional<User> findByUsernameWithClient(@Param("username") String username);
    
    /**
     * Trouver les utilisateurs actifs
     */
    @Query("SELECT u FROM User u WHERE u.enabled = true")
    List<User> findActiveUsers();
}