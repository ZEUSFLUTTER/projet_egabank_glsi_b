package com.ega.bank.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("COMPTE_COURANT")
@Getter
@Setter
@NoArgsConstructor
public class CompteCourant extends Compte {
    
    @Column(name = "decouvert_autorise")
    private java.math.BigDecimal decouvertAutorise = java.math.BigDecimal.ZERO;
    
    @PostLoad
    private void setTypeCompte() {
        super.setTypeCompte(TypeCompte.COMPTE_COURANT);
    }
    
    @Override
    public void retirer(java.math.BigDecimal montant) {
        if (montant.compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        
        java.math.BigDecimal soldeDisponible = getSolde().add(decouvertAutorise);
        if (soldeDisponible.compareTo(montant) < 0) {
            throw new IllegalArgumentException("Solde insuffisant (découvert dépassé)");
        }
        
        setSolde(getSolde().subtract(montant));
    }
}