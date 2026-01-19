package banque.service;

import banque.entity.Client;
import banque.entity.DemandeCompte;
import banque.entity.Utilisateur;
import banque.enums.StatutDemande;
import banque.enums.TypeCompte;
import banque.repository.ClientRepository;
import banque.repository.DemandeCompteRepository;
import banque.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import banque.exception.*;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemandeService {

    private final DemandeCompteRepository demandeRepository;
    private final ClientRepository clientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CompteService compteService;

    /**
     * 1. CLIENT : Créer une nouvelle demande
     */
    @Transactional
    public DemandeCompte creerDemande(Long clientId, TypeCompte typeCompte) {
        // A. Vérifier le client
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BanqueException("Client introuvable (ID: " + clientId + ")"));

        // B. Sécurité : Un client désactivé ne peut pas demander de compte
        if (client.isEstSupprime()) {
            throw new BanqueException("Impossible de créer une demande : Ce client est désactivé.");
        }

        // C. (Optionnel) Vérifier s'il a déjà une demande en cours pour ce type
        // Cela évite le spam de demandes
        boolean demandeExiste = demandeRepository.findByClientId(clientId).stream()
                .anyMatch(d -> d.getTypeCompte() == typeCompte && d.getStatut() == StatutDemande.EN_ATTENTE);

        if (demandeExiste) {
            throw new BanqueException("Vous avez déjà une demande en cours pour ce type de compte.");
        }

        // D. Création
        DemandeCompte demande = DemandeCompte.builder()
                .client(client)
                .typeCompte(typeCompte)
                .statut(StatutDemande.EN_ATTENTE)
                .dateDemande(LocalDateTime.now())
                .build();

        return demandeRepository.save(demande);
    }

    /**
     * 2. ADMIN : Voir les demandes en attente
     */
    public List<DemandeCompte> getDemandesEnAttente() {
        return demandeRepository.findByStatutOrderByDateDemandeDesc(StatutDemande.EN_ATTENTE);
    }

    /**
     * 3. ADMIN : Voir toutes les demandes d'un client (Historique)
     */
    public List<DemandeCompte> getDemandesClient(Long clientId) {
        return demandeRepository.findByClientId(clientId);
    }

    /**
     * 4. ADMIN : Valider une demande
     */
    @Transactional
    public void validerDemande(Long idDemande, String usernameAdmin) {
        // A. Récupérer la demande
        DemandeCompte demande = demandeRepository.findById(idDemande)
                .orElseThrow(() -> new BanqueException("Demande introuvable (ID: " + idDemande + ")"));

        // B. Vérifier statut
        if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
            throw new BanqueException("Cette demande a déjà été traitée (" + demande.getStatut() + ").");
        }

        // C. Vérifier si le client n'a pas été supprimé entre temps
        if (demande.getClient().isEstSupprime()) {
            // On rejette automatiquement si le client est parti
            rejeterDemande(idDemande, usernameAdmin, "Client désactivé avant validation.");
            return;
        }

        // D. Récupérer l'admin responsable
        Utilisateur admin = utilisateurRepository.findByUsername(usernameAdmin)
                .orElseThrow(() -> new BanqueException("Admin introuvable : " + usernameAdmin));

        // E. CRÉATION DU VRAI COMPTE (Via CompteService)
        compteService.creerCompte(demande.getClient().getId(), demande.getTypeCompte());

        // F. Mettre à jour la demande
        demande.setStatut(StatutDemande.VALIDEE);
        demande.setDateTraitement(LocalDateTime.now());
        demande.setAdminTraiteur(admin);

        demandeRepository.save(demande);
    }

    /**
     * 5. ADMIN : Rejeter une demande
     */
    @Transactional
    public void rejeterDemande(Long idDemande, String usernameAdmin, String motif) {
        DemandeCompte demande = demandeRepository.findById(idDemande)
                .orElseThrow(() -> new BanqueException("Demande introuvable"));

        if (demande.getStatut() != StatutDemande.EN_ATTENTE) {
            throw new BanqueException("Cette demande ne peut plus être rejetée (Statut actuel : " + demande.getStatut() + ")");
        }

        Utilisateur admin = utilisateurRepository.findByUsername(usernameAdmin)
                .orElseThrow(() -> new BanqueException("Admin introuvable"));

        demande.setStatut(StatutDemande.REJETEE);
        demande.setMotifRejet(motif != null ? motif : "Aucun motif précisé.");
        demande.setDateTraitement(LocalDateTime.now());
        demande.setAdminTraiteur(admin);

        demandeRepository.save(demande);
    }
}