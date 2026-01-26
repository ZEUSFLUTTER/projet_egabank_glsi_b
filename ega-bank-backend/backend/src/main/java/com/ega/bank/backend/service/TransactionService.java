package com.ega.bank.backend.service;

import com.ega.bank.backend.entity.Compte;
import com.ega.bank.backend.entity.Transaction;
import com.ega.bank.backend.entity.Utilisateur;
import com.ega.bank.backend.enums.TypeTransaction;
import com.ega.bank.backend.enums.TypeUtilisateur;
import com.ega.bank.backend.exception.BusinessException;
import com.ega.bank.backend.repository.CompteRepository;
import com.ega.bank.backend.repository.TransactionRepository;
import com.ega.bank.backend.repository.UtilisateurRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class TransactionService {

    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;
    private final UtilisateurRepository utilisateurRepository;

    public TransactionService(
            CompteRepository compteRepository,
            TransactionRepository transactionRepository,
            UtilisateurRepository utilisateurRepository) {
        this.compteRepository = compteRepository;
        this.transactionRepository = transactionRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Transactional
    public void depot(String numeroCompte, BigDecimal montant) {

        Utilisateur utilisateur = getUtilisateurConnecte();
        verifierClient(utilisateur, numeroCompte);

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }

        Compte compte = getCompte(numeroCompte);
        compte.setSolde(compte.getSolde().add(montant));

        enregistrerTransaction(TypeTransaction.DEPOT, montant, compte, null);
        compteRepository.save(compte);
    }

    @Transactional
    public void retrait(String numeroCompte, BigDecimal montant) {

        Utilisateur utilisateur = getUtilisateurConnecte();
        verifierClient(utilisateur, numeroCompte);

        Compte compte = getCompte(numeroCompte);

        if (compte.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        compte.setSolde(compte.getSolde().subtract(montant));
        enregistrerTransaction(TypeTransaction.RETRAIT, montant, compte, null);

        compteRepository.save(compte);
    }

    @Transactional
    public void virement(String sourceNumero, String destinationNumero, BigDecimal montant) {

        Utilisateur utilisateur = getUtilisateurConnecte();
        verifierClient(utilisateur, sourceNumero);

        Compte source = getCompte(sourceNumero);
        Compte destination = getCompte(destinationNumero);

        if (source.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        source.setSolde(source.getSolde().subtract(montant));
        destination.setSolde(destination.getSolde().add(montant));

        enregistrerTransaction(TypeTransaction.VIREMENT, montant, source, destination);

        compteRepository.save(source);
        compteRepository.save(destination);
    }

    // OUTILS
    private void verifierClient(Utilisateur utilisateur, String numeroCompte) {

        if (utilisateur.getRole() != TypeUtilisateur.CLIENT) {
            throw new BusinessException("Seul un client peut effectuer des opérations");
        }

        Compte compte = getCompte(numeroCompte);

        if (!compte.getClient().getId().equals(utilisateur.getClient().getId())) {
            throw new BusinessException("Accès interdit à ce compte");
        }
    }

    private Utilisateur getUtilisateurConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BusinessException("Utilisateur non authentifié"));
    }

    private Compte getCompte(String numero) {
        return compteRepository.findByNumeroCompte(numero)
                .orElseThrow(() -> new BusinessException("Compte introuvable"));
    }

    private void enregistrerTransaction(
            TypeTransaction type,
            BigDecimal montant,
            Compte source,
            Compte destination) {

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(type);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(source);
        transaction.setCompteDestination(destination);

        transactionRepository.save(transaction);
    }
}