package banque.service;

import banque.entity.Transaction;
import banque.enums.TypeTransaction;
import banque.exception.*;
import banque.entity.Client;
import banque.entity.Compte;
import banque.enums.StatutCompte;
import banque.enums.TypeCompte;
import banque.repository.ClientRepository;
import banque.repository.CompteRepository;
import banque.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static banque.config.DataSeeder.COMPTE_BANQUE_INTERNE;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public Compte creerCompte(Long clientId, TypeCompte typeCompte) {
        // Vérifier que le client existe et n'est PAS supprimé
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BanqueException("Client introuvable !"));

        if (Boolean.TRUE.equals(client.getEstSupprime())) {
            throw new BanqueException("Impossible de créer un compte : Ce client est désactivé.");
        }

        // Générer un IBAN unique (Boucle de sécurité)
        String numCompte;
        do {
            // Génère un IBAN aléatoire
            numCompte = Iban.random(CountryCode.FR).toString();
        } while (compteRepository.findByNumeroCompte(numCompte).isPresent());

        // C. Création de l'objet Compte
        Compte nouveauCompte = Compte.builder()
                .numeroCompte(numCompte)
                .typeCompte(typeCompte)
                .dateCreation(LocalDateTime.now())
                .solde(BigDecimal.ZERO)
                .client(client)
                .build();

        return compteRepository.save(nouveauCompte);
    }

    /**
      RECHERCHE PAR IBAN (Numéro de compte)
     */
    public Compte getCompteByNumero(String numeroCompte) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new BanqueException("Compte introuvable avec le numéro : " + numeroCompte));
        if (Boolean.TRUE.equals(compte.getClient().getEstSupprime())) {
            throw new BanqueException("Compte inexistant !");
        }

        if (compte.getStatut() == StatutCompte.CLOTURE) {
            throw new BanqueException("Ce compte est clôturé définitivement depuis le " + compte.getDateCloture());
        }

        return compte;
    }

    /**  LISTE DES COMPTES D'UN CLIENT
     */
    public List<Compte> getComptesByClient(Long clientId) {
        // On vérifie d'abord le client
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BanqueException("Client introuvable"));
        // On renvoie ses comptes
        return compteRepository.findByClient(client);
    }

    /**
     RECHERCHE PAR TYPE DE COMPTE
     */
    public List<Compte> getComptesByType(TypeCompte typeCompte) {
        if (typeCompte == null) {
            throw new BanqueException("Le type de compte est obligatoire pour la recherche.");
        }
        return compteRepository.findByTypeCompte(typeCompte);
    }

    /**
     VÉRIFICATION SIMPLE (Utile pour le validateur de virement)
     */
    public boolean compteExiste(String numeroCompte) {
        return compteRepository.findByNumeroCompte(numeroCompte)
                .filter(c -> c.getStatut() != StatutCompte.CLOTURE)
                .filter(c -> !Boolean.TRUE.equals(c.getClient().getEstSupprime()))
                .isPresent();
    }

    /**
     * MISE À JOUR : On ne change que le statut (Ex: Bloquer un compte)
     */
    @Transactional
    public Compte changerStatutCompte(String numeroCompte, StatutCompte nouveauStatut) {
        Compte compte = getCompteByNumero(numeroCompte);

        // On ne peut pas réactiver un compte clôturé
        if (compte.getStatut() == StatutCompte.CLOTURE) {
            throw new BanqueException("Impossible de modifier un compte clôturé définitivement.");
        }

        compte.setStatut(nouveauStatut);
        return compteRepository.save(compte);
    }

    /** SUPPRESSION (CLÔTURE) */
    @Transactional
    public void cloturerCompte(String numeroCompte) {
        Compte compteClient = getCompteByNumero(numeroCompte);

        // 1. Vérification si déjà clos
        if (compteClient.getStatut() == StatutCompte.CLOTURE) {
            throw new BanqueException("Ce compte est déjà clôturé.");
        }

        // 2. GESTION DU SOLDE RESTANT
        if (compteClient.getSolde().compareTo(BigDecimal.ZERO) > 0) {
            // A. Récupérer le compte de la banque
            Compte compteBanque = compteRepository.findByNumeroCompte(COMPTE_BANQUE_INTERNE)
                    .orElseThrow(() -> new BanqueException("Erreur critique : Compte de la banque introuvable."));

            BigDecimal soldeRestant = compteClient.getSolde();

            // B. Créditer le compte de la banque
            compteBanque.setSolde(compteBanque.getSolde().add(soldeRestant));

            // C. Mettre le solde du client à 0
            compteClient.setSolde(BigDecimal.ZERO);

            // D. Sauvegarder les comptes
            compteRepository.save(compteBanque);

            // E. Créer une trace de transaction (Optionnel mais recommandé)
            creerTransactionDeCloture(compteClient, compteBanque, soldeRestant);

            System.out.println("💰 Transfert de " + soldeRestant + " FCFA vers la banque effectué.");
        }

        // 3. Clôture définitive
        compteClient.setStatut(StatutCompte.CLOTURE);
        compteClient.setDateCloture(LocalDateTime.now());
        compteRepository.save(compteClient);
    }

    // Méthode helper pour l'historique
    private void creerTransactionDeCloture(Compte source, Compte dest, BigDecimal montant) {
        Transaction t = Transaction.builder()
                .type(TypeTransaction.VIREMENT)
                .montant(montant)
                .dateTransaction(LocalDateTime.now())
                .description("Saisie de solde pour clôture de compte")
                .compteSource(source)
                .compteDestination(dest)
                .soldeApres(BigDecimal.ZERO) // Pour le client
                .build();
        transactionRepository.save(t);
    }

    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }
}