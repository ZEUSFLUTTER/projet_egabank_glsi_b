package banque.repository;

import banque.entity.DemandeCompte;
import banque.enums.StatutDemande;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface DemandeCompteRepository extends JpaRepository<DemandeCompte, Long> {
    List<DemandeCompte> findByStatut(StatutDemande statut);
    List<DemandeCompte> findByClientId(Long clientId);
    List<DemandeCompte> findByStatutOrderByDateDemandeDesc(StatutDemande statut);
    long countByStatutNot(StatutDemande statut);
}
