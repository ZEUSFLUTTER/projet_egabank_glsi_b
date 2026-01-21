/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.controleur;

import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.service.TransactionService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionControleur {
    private final TransactionService serviceTransactions;

    public TransactionControleur(TransactionService serviceTransactions) {
        this.serviceTransactions = serviceTransactions;
    }

    @GetMapping("/{numeroCompte}")
    public List<Transaction> listerParPeriode(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) {
        return serviceTransactions.listerParPeriode(numeroCompte, dateDebut, dateFin);
    }
    
    @GetMapping
    public List<Transaction> lister() {
        return serviceTransactions.lister();
    }
}
