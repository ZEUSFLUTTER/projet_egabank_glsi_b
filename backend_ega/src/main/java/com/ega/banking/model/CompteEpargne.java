package com.ega.banking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "comptes_epargne")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteEpargne extends Compte {
    
    @DecimalMin(value = "0.0", message = "Le taux d'intérêt ne peut pas être négatif")
    @DecimalMax(value = "100.0", message = "Le taux d'intérêt ne peut pas dépasser 100%")
    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tauxInteret = new BigDecimal("2.5"); // 2.5% par défaut
    
    @PrePersist
    public void setType() {
        super.setType(TypeCompte.EPARGNE);
    }
}
