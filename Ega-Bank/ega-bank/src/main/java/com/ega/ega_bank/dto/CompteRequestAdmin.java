package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.TypeCompte;
import jakarta.validation.constraints.NotNull;

public class CompteRequestAdmin {

    @NotNull
    private TypeCompte type;

    @NotNull
    private Long proprietaireId;

    private Double soldeInitial;

    // --- Constructeurs ---
    public CompteRequestAdmin() {
    }

    public CompteRequestAdmin(TypeCompte type, Long proprietaireId, Double soldeInitial) {
        this.type = type;
        this.proprietaireId = proprietaireId;
        this.soldeInitial = soldeInitial;
    }

    // --- Getters et Setters ---
    public TypeCompte getType() {
        return type;
    }

    public void setType(TypeCompte type) {
        this.type = type;
    }

    public Long getProprietaireId() {
        return proprietaireId;
    }

    public void setProprietaireId(Long proprietaireId) {
        this.proprietaireId = proprietaireId;
    }

    public Double getSoldeInitial() {
        return soldeInitial;
    }

    public void setSoldeInitial(Double soldeInitial) {
        this.soldeInitial = soldeInitial;
    }

    @Override
    public String toString() {
        return "CompteRequestAdmin{" +
                "type=" + type +
                ", proprietaireId=" + proprietaireId +
                ", soldeInitial=" + soldeInitial +
                '}';
    }
}
