package com.egabank.Backend.service;

import com.egabank.Backend.entity.Transaction;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author HP
 */
public interface TransactionClientService {
    List<Transaction> listerMesTransactions(String courrielClient);
    List<Transaction> listerTransactionsCompte(Long compteId, String courrielClient);
    List<Transaction> listerTransactionsPeriode(Long compteId, LocalDate dateDebut, LocalDate dateFin, String courrielClient);
}