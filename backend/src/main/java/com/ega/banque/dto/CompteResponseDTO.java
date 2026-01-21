package com.ega.banque.dto;

import com.ega.banque.entity.TypeCompte;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CompteResponseDTO {

    private Long id;
    private String numeroCompte;
    private TypeCompte typeCompte;
    private BigDecimal solde;
    private LocalDate dateCreation;
    private Long clientId;

    public CompteResponseDTO(
            Long id,
            String numeroCompte,
            TypeCompte typeCompte,
            BigDecimal solde,
            LocalDate dateCreation,
            Long clientId) {
        this.id = id;
        this.numeroCompte = numeroCompte;
        this.typeCompte = typeCompte;
        this.solde = solde;
        this.dateCreation = dateCreation;
        this.clientId = clientId;
    }

    public Long getId() {
        return id;
    }

    public String getNumeroCompte() {
        return numeroCompte;
    }

    public TypeCompte getTypeCompte() {
        return typeCompte;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public Long getClientId() {
        return clientId;
    }
}
