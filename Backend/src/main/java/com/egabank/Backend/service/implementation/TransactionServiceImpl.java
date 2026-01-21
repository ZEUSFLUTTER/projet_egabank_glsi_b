/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.TransactionService;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
@Service
@Transactional(readOnly = true)
public class TransactionServiceImpl implements TransactionService{
    private final TransactionRepository depotTransaction;

    public TransactionServiceImpl(TransactionRepository depotTransaction) {
        this.depotTransaction = depotTransaction;
    }

    @Override
    public List<Transaction> listerParPeriode(String numeroCompte, LocalDate dateDebut, LocalDate dateFin) {
        LocalDateTime debut = dateDebut.atStartOfDay();
        LocalDateTime fin = LocalDateTime.of(dateFin, LocalTime.MAX);
        return depotTransaction.listerParPeriode(numeroCompte, debut, fin);
    }
    
    @Override
    public List<Transaction> lister() {
        return depotTransaction.findAll();
    }
}
