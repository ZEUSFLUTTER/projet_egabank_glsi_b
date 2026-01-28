package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ReleveResponse {

    private String numeroCompte;
    private LocalDateTime debut;
    private LocalDateTime fin;
    private BigDecimal soldeInitial;
    private BigDecimal soldeFinal;
    private List<Transaction> transactions;

    // --- Constructeurs ---
    public ReleveResponse() {
    }

    public ReleveResponse(String numeroCompte, LocalDateTime debut, LocalDateTime fin,
                          BigDecimal soldeInitial, BigDecimal soldeFinal, List<Transaction> transactions) {
        this.numeroCompte = numeroCompte;
        this.debut = debut;
        this.fin = fin;
        this.soldeInitial = soldeInitial;
        this.soldeFinal = soldeFinal;
        this.transactions = transactions;
    }

    // --- Getters et Setters ---
    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public LocalDateTime getDebut() {
        return debut;
    }

    public void setDebut(LocalDateTime debut) {
        this.debut = debut;
    }

    public LocalDateTime getFin() {
        return fin;
    }

    public void setFin(LocalDateTime fin) {
        this.fin = fin;
    }

    public BigDecimal getSoldeInitial() {
        return soldeInitial;
    }

    public void setSoldeInitial(BigDecimal soldeInitial) {
        this.soldeInitial = soldeInitial;
    }

    public BigDecimal getSoldeFinal() {
        return soldeFinal;
    }

    public void setSoldeFinal(BigDecimal soldeFinal) {
        this.soldeFinal = soldeFinal;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    // --- toString ---
    @Override
    public String toString() {
        return "ReleveResponse{" +
                "numeroCompte='" + numeroCompte + '\'' +
                ", debut=" + debut +
                ", fin=" + fin +
                ", soldeInitial=" + soldeInitial +
                ", soldeFinal=" + soldeFinal +
                ", transactions=" + transactions +
                '}';
    }
}
