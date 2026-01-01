package com.ega.banking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "comptes_courant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteCourant extends Compte {
    
    @DecimalMin(value = "0.0", message = "Le découvert autorisé ne peut pas être négatif")
    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal decouvertAutorise = BigDecimal.ZERO;
    
    @PrePersist
    public void setType() {
        super.setType(TypeCompte.COURANT);
    }
    
    @Override
    public void debiter(BigDecimal montant) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        BigDecimal soldeDisponible = getSolde().add(decouvertAutorise);
        if (soldeDisponible.compareTo(montant) < 0) {
            throw new IllegalStateException("Solde insuffisant (découvert dépassé)");
        }
        setSolde(getSolde().subtract(montant));
    }
}
