package com.ega.util;

import org.iban4j.Iban;
import org.springframework.stereotype.Component;

@Component
public class IbanGenerator {
    
    /**
     * Génère un numéro IBAN valide pour un compte bancaire
     * Utilise le code pays "TN" (Tunisie) par défaut
     * 
     * @return un numéro IBAN valide (34 caractères)
     */
    public String generateIban() {
        // Génération d'un IBAN avec code pays TN (Tunisie)
        // Le BBAN est généré aléatoirement
        Iban iban = Iban.random(org.iban4j.CountryCode.TN);
        return iban.toString();
    }
    
    /**
     * Valide un numéro IBAN
     * 
     * @param iban le numéro IBAN à valider
     * @return true si l'IBAN est valide, false sinon
     */
    public boolean isValidIban(String iban) {
        try {
            Iban.valueOf(iban);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

