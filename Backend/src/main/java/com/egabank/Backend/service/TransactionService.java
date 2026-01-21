/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.egabank.Backend.service;

import com.egabank.Backend.entity.Transaction;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author HP
 */
public interface TransactionService {
    List<Transaction> listerParPeriode(String numeroCompte, LocalDate dateDebut, LocalDate dateFin);
    List<Transaction> lister();
}
