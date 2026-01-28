package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.TypeCompte;
import jakarta.validation.constraints.NotNull;

public class CompteRequestClient {

    @NotNull
    private TypeCompte type;

    private Double soldeInitial;

    // --- Constructeurs ---
    public CompteRequestClient() {
    }

    public CompteRequestClient(TypeCompte type, Double soldeInitial) {
        this.type = type;
        this.soldeInitial = soldeInitial;
    }

    // --- Getters et Setters ---
    public TypeCompte getType() {
        return type;
    }

    public void setType(TypeCompte type) {
        this.type = type;
    }

    public Double getSoldeInitial() {
        return soldeInitial;
    }

    public void setSoldeInitial(Double soldeInitial) {
        this.soldeInitial = soldeInitial;
    }

    @Override
    public String toString() {
        return "CompteRequestClient{" +
                "type=" + type +
                ", soldeInitial=" + soldeInitial +
                '}';
    }
}
