/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.TransactionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Transaction creer(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public Transaction consulter(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction non trouvée: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> listerParCompte(String numeroCompte) {
        return transactionRepository.findByNumeroCompte(numeroCompte);
    }

    @Override
    public void supprimer(Long id) {
        Transaction transaction = consulter(id);
        transactionRepository.delete(transaction);
    }

    @Override
    public List<Transaction> listerParPeriode(String numeroCompte, LocalDate dateDebut, LocalDate dateFin) {
        LocalDateTime debut = dateDebut.atStartOfDay();
        LocalDateTime fin = LocalDateTime.of(dateFin, LocalTime.MAX);
        return transactionRepository.listerParPeriode(numeroCompte, debut, fin);
    }
    
    @Override
    public List<Transaction> lister() {
        return transactionRepository.findAll();
    }
}
