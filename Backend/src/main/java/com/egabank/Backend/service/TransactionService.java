package com.egabank.Backend.service;

import com.egabank.Backend.entity.Transaction;
import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    Transaction creer(Transaction transaction);
    Transaction consulter(Long id);
    List<Transaction> listerParCompte(String numeroCompte);
    void supprimer(Long id);

    // 🔹 Ajouter ces méthodes
    List<Transaction> lister();
    List<Transaction> listerParPeriode(String numeroCompte, LocalDate dateDebut, LocalDate dateFin);
}
