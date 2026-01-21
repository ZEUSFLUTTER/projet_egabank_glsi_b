package banque.service;

import banque.entity.Compte;
import banque.entity.Transaction;
import banque.enums.StatutCompte;
import banque.enums.TypeTransaction;
import banque.repository.CompteRepository;
import banque.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import banque.exception.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationService {

    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;
    private final CompteService compteService;


    private void verifierStatutCompte(Compte compte) {
        if (compte.getStatut() == StatutCompte.CLOTURE) {
            throw new BanqueException("Opération impossible : Le compte " + compte.getNumeroCompte() + " est CLÔTURÉ.");
        }
        if (compte.getStatut() == StatutCompte.SUSPENDU) {
            throw new BanqueException("Opération impossible : Le compte " + compte.getNumeroCompte() + " est SUSPENDU.");
        }
    }

    // --- VERSEMENT (Dépôt d'espèces) ---
    @Transactional
    public void effectuerVersement(String numeroCompte, BigDecimal montant) {
        Compte compte = compteService.getCompteByNumero(numeroCompte);
        verifierStatutCompte(compte);
        // Validation basique
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BanqueException("Le montant du versement doit être positif.");
        }

        // 2. Mise à jour du solde
        compte.setSolde(compte.getSolde().add(montant));
        compteRepository.save(compte);

        // 3. Création de l'historique (Audit)
        Transaction transaction = Transaction.builder()
                .type(TypeTransaction.VERSEMENT)
                .montant(montant)
                .dateTransaction(LocalDateTime.now())
                .soldeApres(compte.getSolde())
                .description("Versement espèces")
                .compteSource(compte)
                .build();

        transactionRepository.save(transaction);
    }

    // --- 2. RETRAIT (Retrait d'espèces) ---
    @Transactional
    public void effectuerRetrait(String numeroCompte, BigDecimal montant) {

        Compte compte = compteService.getCompteByNumero(numeroCompte);

        verifierStatutCompte(compte);
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BanqueException("Le montant du retrait doit être positif.");
        }

        // Vérification Solvabilité (Solde - Montant >= 0 ?)
        if (compte.getSolde().compareTo(montant) < 0) {
            throw new BanqueException("Solde insuffisant pour effectuer ce retrait. Solde actuel : " + compte.getSolde());
        }

        // Débit
        compte.setSolde(compte.getSolde().subtract(montant));
        compteRepository.save(compte);

        // Historique
        Transaction transaction = Transaction.builder()
                .type(TypeTransaction.RETRAIT)
                .montant(montant)
                .dateTransaction(LocalDateTime.now())
                .description("Retrait espèces")
                .soldeApres(compte.getSolde())
                .compteSource(compte)
                .build();

        transactionRepository.save(transaction);
    }

    // --- 3. VIREMENT (Compte A vers Compte B) ---
    @Transactional
    public void effectuerVirement(String numeroCompteEmetteur, String numeroCompteBeneficiaire, BigDecimal montant) {
        // 1. Récupération des deux comptes
        Compte emetteur = compteService.getCompteByNumero(numeroCompteEmetteur);
        Compte beneficiaire = compteService.getCompteByNumero(numeroCompteBeneficiaire);

        verifierStatutCompte(emetteur);
        verifierStatutCompte(beneficiaire);

        // Validations initiales
        if (numeroCompteEmetteur.equals(numeroCompteBeneficiaire)) {
            throw new BanqueException("Impossible d'effectuer un virement vers le même compte.");
        }
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BanqueException("Le montant du virement doit être positif.");
        }


        // 2. Vérification solde émetteur
        if (emetteur.getSolde().compareTo(montant) < 0) {
            throw new BanqueException("Solde insuffisant pour le virement.");
        }

        // 3. Mouvement d'argent
        emetteur.setSolde(emetteur.getSolde().subtract(montant)); // On retire à A
        beneficiaire.setSolde(beneficiaire.getSolde().add(montant)); // On ajoute à B

        compteRepository.save(emetteur);
        compteRepository.save(beneficiaire);

        // 4. Historique : On crée DEUX lignes de transaction (Standard bancaire)

        // Ligne pour l'émetteur (Débit)
        Transaction transactionDebit = Transaction.builder()
                .type(TypeTransaction.VIREMENT)
                .montant(montant.negate())
                .dateTransaction(LocalDateTime.now())
                .description("Virement vers " + beneficiaire.getClient().getNom())
                .soldeApres(emetteur.getSolde())
                .compteSource(emetteur)
                .compteDestination(beneficiaire)
                .build();

        // Ligne pour le bénéficiaire (Crédit)
        Transaction transactionCredit = Transaction.builder()
                .type(TypeTransaction.VIREMENT)
                .montant(montant)
                .dateTransaction(LocalDateTime.now())
                .description("Virement reçu de " + emetteur.getClient().getNom())
                .soldeApres(beneficiaire.getSolde())
                .compteSource(emetteur)
                .compteDestination(beneficiaire)
                .build();

        transactionRepository.save(transactionDebit);
        transactionRepository.save(transactionCredit);
    }

    public List<Transaction> getHistorique(String numeroCompte) {
        List<Transaction> transactionsBrutes = transactionRepository.findHistoriqueByCompte(numeroCompte);
        return transactionsBrutes.stream()
                .filter(t -> {
                    boolean estSource = t.getCompteSource().getNumeroCompte().equals(numeroCompte);
                    String type = t.getType().toString();
                    if ("RETRAIT".equals(type) || "VERSEMENT".equals(type)) {
                        return true;
                    }
                    if ("VIREMENT".equals(type) && estSource && t.getMontant().compareTo(java.math.BigDecimal.ZERO) > 0) {
                        return false;
                    }
                    return true;
                })
                .collect(java.util.stream.Collectors.toList());
    }
}