package com.ega.egabank.util;

import java.security.SecureRandom;

import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Component;

/**
 * Utilitaire pour la génération de numéros IBAN
 */
@Component
public class IbanGenerator {

    private static final String BANK_CODE = "EGA";
    private static final String BRANCH_CODE = "00001";
    private static final SecureRandom random = new SecureRandom();

    /**
     * Génère un numéro IBAN unique au format togolais
     */
    public String generate() {
        String accountNumber = generateAccountNumber();

        // Construction IBAN format: TG + check digits + bank code + branch + account
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.TG)
                .bankCode(BANK_CODE)
                .branchCode(BRANCH_CODE)
                .accountNumber(accountNumber)
                .build();

        return iban.toString();
    }

    /**
     * Génère un numéro de compte aléatoire de 11 caractères
     */
    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 11; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    /**
     * Formate un IBAN pour l'affichage (groupes de 4 caractères)
     */
    public String formatForDisplay(String iban) {
        if (iban == null || iban.isEmpty()) {
            return iban;
        }
        return iban.replaceAll("(.{4})", "$1 ").trim();
    }

    /**
     * Vérifie si un IBAN est valide
     */
    public boolean isValid(String iban) {
        try {
            Iban.valueOf(iban);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
