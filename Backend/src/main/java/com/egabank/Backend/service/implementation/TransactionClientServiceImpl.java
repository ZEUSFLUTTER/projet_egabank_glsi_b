package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.CompteClientService;
import com.egabank.Backend.service.TransactionClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 *
 * @author HP
 */
@Service
@Transactional(readOnly = true)
public class TransactionClientServiceImpl implements TransactionClientService {
    
    private final TransactionRepository depotTransaction;
    private final CompteClientService serviceCompteClient;

    public TransactionClientServiceImpl(TransactionRepository depotTransaction, 
                                      CompteClientService serviceCompteClient) {
        this.depotTransaction = depotTransaction;
        this.serviceCompteClient = serviceCompteClient;
    }

    @Override
    public List<Transaction> listerMesTransactions(String courrielClient) {
        List<Transaction> transactions = depotTransaction.findByClientCourriel(courrielClient);
        return transactions;
    }

    @Override
    public List<Transaction> listerTransactionsCompte(Long compteId, String courrielClient) {
        // Vérifier que le client a accès à ce compte
        serviceCompteClient.obtenirCompte(compteId, courrielClient);
        
        return depotTransaction.findByCompteIdAndClientCourriel(compteId, courrielClient);
    }

    @Override
    public List<Transaction> listerTransactionsPeriode(Long compteId, LocalDate dateDebut, LocalDate dateFin, String courrielClient) {
        // Vérifier que le client a accès à ce compte
        serviceCompteClient.obtenirCompte(compteId, courrielClient);
        
        LocalDateTime dateDebutTime = dateDebut.atStartOfDay();
        LocalDateTime dateFinTime = dateFin.atTime(23, 59, 59);
        
        return depotTransaction.findByCompteIdAndClientCourrielAndPeriode(compteId, courrielClient, dateDebutTime, dateFinTime);
    }
}