package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.TypeCompte;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CompteResponse {
    private Long id;
    private String numeroCompte;
    private TypeCompte type;
    private LocalDate dateCreation;
    private BigDecimal solde;

    // Constructeurs
    public CompteResponse() {}

    public CompteResponse(Long id, String numeroCompte, TypeCompte type, 
                         LocalDate dateCreation, BigDecimal solde) {
        this.id = id;
        this.numeroCompte = numeroCompte;
        this.type = type;
        this.dateCreation = dateCreation;
        this.solde = solde;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroCompte() { return numeroCompte; }
    public void setNumeroCompte(String numeroCompte) { this.numeroCompte = numeroCompte; }

    public TypeCompte getType() { return type; }
    public void setType(TypeCompte type) { this.type = type; }

    public LocalDate getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDate dateCreation) { this.dateCreation = dateCreation; }

    public BigDecimal getSolde() { return solde; }
    public void setSolde(BigDecimal solde) { this.solde = solde; }
}