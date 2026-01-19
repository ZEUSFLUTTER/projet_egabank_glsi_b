package banque.repository;

import banque.entity.Utilisateur;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsername(String username);
    boolean existsByUsername(String username);
}
