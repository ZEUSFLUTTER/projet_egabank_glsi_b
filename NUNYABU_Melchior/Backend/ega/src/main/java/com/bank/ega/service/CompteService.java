package com.bank.ega.service;

import com.bank.ega.entity.*;
import com.bank.ega.exception.CompteNotFoundException;
import com.bank.ega.exception.SoldeInsuffisantException;
import com.bank.ega.repository.CompteRepository;
import com.bank.ega.repository.TransactionRepository;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;

    public CompteService(CompteRepository compteRepository,
                         TransactionRepository transactionRepository) {
        this.compteRepository = compteRepository;
        this.transactionRepository = transactionRepository;
    }

    // Création d'un compte
    public Compte creerCompte(Client client, TypeCompte typeCompte) {

        String iban = Iban.random().toString();

        Compte compte = new Compte();
        compte.setNumeroCompte(iban);
        compte.setTypeCompte(typeCompte);
        compte.setDateCreation(LocalDateTime.now());
        compte.setSolde(0.0);
        compte.setStatut("ACTIF");  // ✅ Ajouter le statut par défaut
        compte.setClient(client);

        return compteRepository.save(compte);
    }

    // Dépôt
    public void depot(String numeroCompte, Double montant, SourceDepot source) {

        verifierMontant(montant);

        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new CompteNotFoundException("Compte introuvable : " + numeroCompte));

        compte.setSolde(compte.getSolde() + montant);
        compteRepository.save(compte);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.DEPOT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteDestination(compte);
        transaction.setSource(source != null ? source : SourceDepot.MOBILE_MONEY);

        transactionRepository.save(transaction);
    }

    // Dépôt avec source par défaut (pour compatibilité)
    public void depot(String numeroCompte, Double montant) {
        depot(numeroCompte, montant, SourceDepot.MOBILE_MONEY);
    }


    // Retrait
    public void retrait(String numeroCompte, Double montant) {

        verifierMontant(montant);

        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new CompteNotFoundException("Compte introuvable : " + numeroCompte));

        if (compte.getSolde() < montant) {
            throw new SoldeInsuffisantException("Solde insuffisant. Solde actuel : " + compte.getSolde() + ", montant demandé : " + montant);
        }

        compte.setSolde(compte.getSolde() - montant);
        compteRepository.save(compte);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.RETRAIT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(compte);

        transactionRepository.save(transaction);
    }


    // Virement
    public void virement(String source, String destination, Double montant) {

        verifierMontant(montant);

        if (source.equals(destination)) {
            throw new IllegalArgumentException("Le compte source et le compte destination ne peuvent pas être identiques");
        }

        Compte compteSource = compteRepository.findByNumeroCompte(source)
                .orElseThrow(() -> new CompteNotFoundException("Compte source introuvable : " + source));

        Compte compteDestination = compteRepository.findByNumeroCompte(destination)
                .orElseThrow(() -> new CompteNotFoundException("Compte destination introuvable : " + destination));

        if (compteSource.getSolde() < montant) {
            throw new SoldeInsuffisantException("Solde insuffisant sur le compte source. Solde actuel : " + compteSource.getSolde() + ", montant demandé : " + montant);
        }

        compteSource.setSolde(compteSource.getSolde() - montant);
        compteDestination.setSolde(compteDestination.getSolde() + montant);

        compteRepository.save(compteSource);
        compteRepository.save(compteDestination);

        Transaction transaction = new Transaction();
        transaction.setType(TypeTransaction.VIREMENT);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setCompteSource(compteSource);
        transaction.setCompteDestination(compteDestination);

        transactionRepository.save(transaction);
    }

	private void verifierMontant(Double montant) {
        if (montant == null) {
            throw new IllegalArgumentException("Le montant ne peut pas être nul");
        }

        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être supérieur à zéro");
        }

    }

    public List<Compte> getComptesByClient(Long clientId) {
        return compteRepository.findByClientId(clientId);
    }

    // Récupérer tous les comptes (pour admin)
    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    // Récupérer un compte par numéro
    public Compte getCompteByNumero(String numeroCompte) {
        return compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new CompteNotFoundException("Compte introuvable : " + numeroCompte));
    }
}
