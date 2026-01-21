package com.ega.banque.service;

import com.ega.banque.entity.Compte;
import com.ega.banque.entity.Transaction;
import com.ega.banque.repository.CompteRepository;
import com.ega.banque.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    public TransactionService(TransactionRepository transactionRepository,
            CompteRepository compteRepository) {
        this.transactionRepository = transactionRepository;
        this.compteRepository = compteRepository;
    }

    // =========================
    // DÉPÔT
    // =========================
    public Transaction effectuerDepot(Long compteId, BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        compte.setSolde(compte.getSolde().add(montant));
        compteRepository.save(compte);
        System.out.println("DEBUG: Dépôt effectué. Compte ID: " + compteId + ", Montant: " + montant
                + ", Nouveau Solde: " + compte.getSolde());

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction("DEPOT");
        transaction.setMontant(montant);
        transaction.setCompteDestination(compte);
        transaction.setDateTransaction(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================
    // RETRAIT
    // =========================
    public Transaction effectuerRetrait(Long compteId, BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (compte.getSolde().compareTo(montant) < 0) {
            throw new IllegalArgumentException("Solde insuffisant");
        }

        compte.setSolde(compte.getSolde().subtract(montant));
        compteRepository.save(compte);

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction("RETRAIT");
        transaction.setMontant(montant);
        transaction.setCompteSource(compte);
        transaction.setDateTransaction(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================
    // VIREMENT
    // =========================
    public Transaction effectuerVirement(Long compteSourceId, Long compteDestinationId, BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        if (compteSourceId.equals(compteDestinationId)) {
            throw new IllegalArgumentException("Impossible de virer vers le même compte");
        }

        Compte compteSource = compteRepository.findById(compteSourceId)
                .orElseThrow(() -> new RuntimeException("Compte source introuvable"));

        Compte compteDestination = compteRepository.findById(compteDestinationId)
                .orElseThrow(() -> new RuntimeException("Compte destination introuvable"));

        if (compteSource.getSolde().compareTo(montant) < 0) {
            throw new IllegalArgumentException("Solde insuffisant sur le compte source");
        }

        compteSource.setSolde(compteSource.getSolde().subtract(montant));
        compteDestination.setSolde(compteDestination.getSolde().add(montant));

        compteRepository.save(compteSource);
        compteRepository.save(compteDestination);

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction("VIREMENT");
        transaction.setMontant(montant);
        transaction.setCompteSource(compteSource);
        transaction.setCompteDestination(compteDestination);
        transaction.setDateTransaction(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    // =========================
    // Historique des transactions d'un compte
    // =========================
    public List<Transaction> getTransactionsByCompteAndPeriode(
            Long compteId,
            LocalDateTime dateDebut,
            LocalDateTime dateFin) {

        List<Transaction> transactions = new ArrayList<>();

        // Transactions en tant que compte source
        transactions.addAll(
                transactionRepository
                        .findByCompteSourceIdAndDateTransactionBetween(
                                compteId, dateDebut, dateFin));

        // Transactions en tant que compte destination
        transactions.addAll(
                transactionRepository
                        .findByCompteDestinationIdAndDateTransactionBetween(
                                compteId, dateDebut, dateFin));

        return transactions;
    }

    public List<Transaction> getTransactionsByCompte(Long compteId) {
        List<Transaction> transactions = new ArrayList<>();
        transactions.addAll(transactionRepository.findByCompteSourceId(compteId));
        transactions.addAll(transactionRepository.findByCompteDestinationId(compteId));
        return transactions;
    }
}
