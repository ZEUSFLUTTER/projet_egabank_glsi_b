package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.TypeOperation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class OperationRequest {

    @NotNull
    private TypeOperation type;

    @NotNull
    @Positive
    private BigDecimal montant;

    @NotNull
    private String numeroCompteSource;

    private String numeroCompteDestination;

    private String description;

    // --- Constructeurs ---
    public OperationRequest() {
    }

    public OperationRequest(TypeOperation type, BigDecimal montant, String numeroCompteSource,
                            String numeroCompteDestination, String description) {
        this.type = type;
        this.montant = montant;
        this.numeroCompteSource = numeroCompteSource;
        this.numeroCompteDestination = numeroCompteDestination;
        this.description = description;
    }

    // --- Getters et Setters ---
    public TypeOperation getType() {
        return type;
    }

    public void setType(TypeOperation type) {
        this.type = type;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public String getNumeroCompteSource() {
        return numeroCompteSource;
    }

    public void setNumeroCompteSource(String numeroCompteSource) {
        this.numeroCompteSource = numeroCompteSource;
    }

    public String getNumeroCompteDestination() {
        return numeroCompteDestination;
    }

    public void setNumeroCompteDestination(String numeroCompteDestination) {
        this.numeroCompteDestination = numeroCompteDestination;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // --- toString ---
    @Override
    public String toString() {
        return "OperationRequest{" +
                "type=" + type +
                ", montant=" + montant +
                ", numeroCompteSource='" + numeroCompteSource + '\'' +
                ", numeroCompteDestination='" + numeroCompteDestination + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
