package com.ega.backend.service;

import com.ega.backend.model.Transaction;
import com.ega.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // ✅ Méthode pour trouver toutes les transactions
    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    // ✅ Méthode CORRIGEE : pour trouver les transactions liées à un compte (source ou destination)
    public List<Transaction> getTransactionsByCompteId(String compteId) {
        // ✅ Utilise la méthode du repository qui cherche dans les deux champs
        return transactionRepository.findByCompteSourceIdOrCompteDestId(compteId);
    }

    // ✅ Méthode CORRIGEE : pour trouver les transactions liées à un compte sur une période
    public List<Transaction> getTransactionsByCompteIdAndPeriod(String compteId, LocalDateTime start, LocalDateTime end) {
        // ✅ Utilise la méthode du repository qui cherche dans les deux champs ET filtre par date
        return transactionRepository.findByCompteSourceIdOrCompteDestIdAndDateBetween(compteId, start, end);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public List<Transaction> getTransactionsByEmail(String email) {
        // Cette méthode dépend de ton modèle. Pour l'instant, on retourne toutes les transactions
        // Tu devras peut-être la modifier selon ton schéma
        // Par exemple, récupérer les comptes du client, puis les transactions de ces comptes
        return transactionRepository.findAll();
    }
}