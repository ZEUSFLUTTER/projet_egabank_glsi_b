package com.ega.banque.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class VirementRequest {
    
    @NotNull(message = "Le compte source est requis")
    private Long compteSourceId;
    
    @NotNull(message = "Le compte destination est requis")
    private Long compteDestinationId;
    
    @NotNull(message = "Le montant est requis")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal montant;

    public Long getCompteSourceId() {
        return compteSourceId;
    }

    public void setCompteSourceId(Long compteSourceId) {
        this.compteSourceId = compteSourceId;
    }

    public Long getCompteDestinationId() {
        return compteDestinationId;
    }

    public void setCompteDestinationId(Long compteDestinationId) {
        this.compteDestinationId = compteDestinationId;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }
}
