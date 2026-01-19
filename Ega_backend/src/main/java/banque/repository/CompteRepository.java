package banque.repository;

import banque.entity.Client;
import banque.entity.Compte;
import banque.enums.TypeCompte;
import org.springframework.data.jpa.repository.*;
import java.util.*;

public interface CompteRepository extends JpaRepository<Compte, Long> {
    Optional<Compte> findByNumeroCompte(String numeroCompte);
    List<Compte> findByClient(Client client);
    List<Compte> findByTypeCompte(TypeCompte typeCompte);
    List<Compte> findByClientId(Long clientId);
}
