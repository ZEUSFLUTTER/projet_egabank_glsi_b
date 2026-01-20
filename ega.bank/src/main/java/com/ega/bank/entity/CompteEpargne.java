package com.ega.bank.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("COMPTE_EPARGNE")
@Getter
@Setter
@NoArgsConstructor
public class CompteEpargne extends Compte {
    
    @Column(name = "taux_interet")
    private Double tauxInteret = 0.0;
    
    @PostLoad
    private void setTypeCompte() {
        super.setTypeCompte(TypeCompte.COMPTE_EPARGNE);
    }
    
    /**
     * Méthode pour calculer et ajouter les intérêts
     */
    public void appliquerInterets() {
        if (tauxInteret != null && tauxInteret > 0) {
            java.math.BigDecimal interets = getSolde()
                .multiply(java.math.BigDecimal.valueOf(tauxInteret))
                .divide(java.math.BigDecimal.valueOf(100), java.math.RoundingMode.HALF_UP);
            setSolde(getSolde().add(interets));
        }
    }
}