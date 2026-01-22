package com.bank.ega.service;

import com.bank.ega.entity.Compte;
import com.bank.ega.entity.Transaction;
import com.bank.ega.repository.CompteRepository;
import com.bank.ega.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    // Récupérer toutes les transactions d'un compte
    public List<Transaction> getTransactionsByCompteId(Long compteId) {
        return transactionRepository.findByCompteId(compteId);
    }

    // Récupérer les transactions d'un compte par numéro de compte
    public List<Transaction> getTransactionsByNumeroCompte(String numeroCompte) {
        return transactionRepository.findByNumeroCompte(numeroCompte);
    }

    // Récupérer les transactions d'un compte sur une période
    public List<Transaction> getTransactionsByCompteIdAndPeriod(Long compteId, 
                                                                 LocalDateTime debut, 
                                                                 LocalDateTime fin) {
        return transactionRepository.findByCompteIdAndDateTransactionBetween(compteId, debut, fin);
    }

    // Récupérer les transactions d'un compte par numéro sur une période
    public List<Transaction> getTransactionsByNumeroCompteAndPeriod(String numeroCompte,
                                                                      LocalDateTime debut,
                                                                      LocalDateTime fin) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        return transactionRepository.findByCompteIdAndDateTransactionBetween(
                compte.getId(), debut, fin);
    }

    // Récupérer toutes les transactions (pour admin)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllOrderByDateDesc();
    }

    // Récupérer les transactions d'un client (tous ses comptes)
    public List<Transaction> getTransactionsByClientId(Long clientId) {
        List<Compte> comptes = compteRepository.findByClientId(clientId);
        return comptes.stream()
                .flatMap(compte -> transactionRepository.findByCompteId(compte.getId()).stream())
                .sorted((t1, t2) -> t2.getDateTransaction().compareTo(t1.getDateTransaction()))
                .toList();
    }
}
