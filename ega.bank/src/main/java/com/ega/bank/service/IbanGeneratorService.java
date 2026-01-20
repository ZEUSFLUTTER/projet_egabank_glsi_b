package com.ega.bank.service;

import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * Service de génération de numéros IBAN
 */
@Service
public class IbanGeneratorService {

    private final Random random = new Random();

    /**
     * Génère un numéro IBAN unique pour un compte
     * Format France: FR + 2 chiffres de contrôle + code banque (5) + code guichet
     * (5) +
     * numéro de compte (8)
     * Résultat: 27 caractères au total
     */
    public String generateIban() {
        // Code banque (5 chiffres)
        String bankCode = String.format("%05d", random.nextInt(100000));

        // Code guichet (5 chiffres)
        String branchCode = String.format("%05d", random.nextInt(100000));

        // Numéro de compte (8 chiffres) - pour respecter le format IBAN France
        long accountLong = random.nextLong(100000000L); // 0 à 99999999 (8 chiffres)
        String accountNumber = String.format("%08d", accountLong);

        // Génération de l'IBAN avec iban4j
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.FR)
                .bankCode(bankCode)
                .branchCode(branchCode)
                .accountNumber(accountNumber)
                .build();

        return iban.toString();
    }

    /**
     * Valide un numéro IBAN
     */
    public boolean isValidIban(String ibanString) {
        try {
            Iban.valueOf(ibanString);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Formate un IBAN (ajoute des espaces tous les 4 caractères)
     */
    public String formatIban(String ibanString) {
        if (ibanString == null || ibanString.isEmpty()) {
            return ibanString;
        }
        return ibanString.replaceAll("(.{4})", "$1 ").trim();
    }
}