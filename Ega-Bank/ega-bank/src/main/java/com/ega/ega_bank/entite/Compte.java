package com.ega.ega_bank.entite;

import com.ega.ega_bank.entite.enums.TypeCompte;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 34)
    private String numeroCompte;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TypeCompte type;

    @NotNull
    private LocalDate dateCreation;

    @NotNull
    @PositiveOrZero
    private BigDecimal solde = BigDecimal.ZERO;

    @ManyToOne(optional = false)
    @JoinColumn(name = "proprietaire_id")
    @JsonIgnore
    private Client proprietaire;

    @OneToMany(mappedBy = "compteSource", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Transaction> transactionsSortantes = new ArrayList<>();

    @OneToMany(mappedBy = "compteDestination", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Transaction> transactionsEntrantes = new ArrayList<>();

    // --- Constructeurs ---
    public Compte() {
    }

    public Compte(String numeroCompte, TypeCompte type, LocalDate dateCreation,
                  BigDecimal solde, Client proprietaire) {
        this.numeroCompte = numeroCompte;
        this.type = type;
        this.dateCreation = dateCreation;
        this.solde = solde;
        this.proprietaire = proprietaire;
    }

    // --- Getters et Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public TypeCompte getType() {
        return type;
    }

    public void setType(TypeCompte type) {
        this.type = type;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }

    public Client getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Client proprietaire) {
        this.proprietaire = proprietaire;
    }

    public List<Transaction> getTransactionsSortantes() {
        return transactionsSortantes;
    }

    public void setTransactionsSortantes(List<Transaction> transactionsSortantes) {
        this.transactionsSortantes = transactionsSortantes;
    }

    public List<Transaction> getTransactionsEntrantes() {
        return transactionsEntrantes;
    }

    public void setTransactionsEntrantes(List<Transaction> transactionsEntrantes) {
        this.transactionsEntrantes = transactionsEntrantes;
    }

    // --- toString ---
    @Override
    public String toString() {
        return "Compte{" +
                "id=" + id +
                ", numeroCompte='" + numeroCompte + '\'' +
                ", type=" + type +
                ", dateCreation=" + dateCreation +
                ", solde=" + solde +
                ", proprietaire=" + (proprietaire != null ? proprietaire.getId() : null) +
                '}';
    }
}
