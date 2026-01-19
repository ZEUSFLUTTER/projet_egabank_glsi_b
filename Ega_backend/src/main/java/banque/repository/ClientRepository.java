package banque.repository;

import banque.entity.Client;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByEstSupprimeFalse();
    Optional<Client> findByEmailAndEstSupprimeFalse(String email);
    @Query("SELECT c FROM Client c " + "WHERE (UPPER(c.nom) LIKE UPPER(CONCAT('%', :valeur, '%')) " +
            "OR UPPER(c.prenom) LIKE UPPER(CONCAT('%', :valeur, '%'))) " + "AND c.estSupprime = false")
    List<Client> rechercherParNomOuPrenom(@Param("valeur") String valeur);
    Optional<Client> findByTelephoneAndEstSupprimeFalse(String telephone);
    boolean existsByEmailAndEstSupprimeFalse(String email);
    long countByEstSupprimeFalse();
}
