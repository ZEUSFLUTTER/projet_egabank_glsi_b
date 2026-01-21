package com.ega.bank.service;

import org.iban4j.CountryCode;
import org.iban4j.Iban;
import com.ega.bank.ressources.MyIbanStructure;
import org.iban4j.UnsupportedCountryException;
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
     * Format France: FR + 2 chiffres de contrôle + code banque (5) + code guichet (5) +
     * numéro de compte (11) + clé RIB (2)
     * Résultat: 27 caractères au total
     */
    public String generateIban() {
        // Code banque (5 chiffres)
        String bankCode = String.format("%05d", random.nextInt(100000));

        // Code guichet (5 chiffres)
        String branchCode = String.format("%05d", random.nextInt(100000));

        // Numéro de compte (11 chiffres au lieu de 8 pour respecter le format FR)
        long accountLong = Math.abs(random.nextLong()) % 100000000000L; // 0 à 99999999999
        String accountNumber = String.format("%011d", accountLong);

        // Calcul de la clé RIB (national check digit) - Formule standard FR
        long b = Long.parseLong(bankCode);
        long g = Long.parseLong(branchCode);
        long c = Long.parseLong(accountNumber);
        long val = b * 89 + g * 15 + c * 3;
        long mod = val % 97;
        int key = (int) (97 - mod);
        String nationalCheckDigit = String.format("%02d", key);

        // Génération de l'IBAN avec iban4j
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.FR)
                .bankCode(bankCode)
                .branchCode(branchCode)
                .accountNumber(accountNumber)
                .nationalCheckDigit(nationalCheckDigit)
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

    // Bonus : Pour supporter d'autres pays (ex. basé sur nationalité du client)
    /**
     * Génère un numéro IBAN unique basé sur la nationalité
     * @param nationalite La nationalité du client (ex. "Française", "Togolaise")
     */
    public String generateIban(String nationalite) {
        CountryCode countryCode = mapNationaliteToCode(nationalite);
        
        // Fetch structure auto pour le pays
        MyIbanStructure structure = MyIbanStructure.forCountry(countryCode);
        if (structure == null) {
            throw new UnsupportedCountryException("Pays non supporté: " + countryCode);
        }

        // Génére composants basés sur les longueurs du pays
        String bankCode = generateRandomString(structure.getBankCodeLength(), structure.isBankCodeAlphaNumeric());
        String branchCode = generateRandomString(structure.getBranchCodeLength(), structure.isBranchCodeAlphaNumeric());
        String accountNumber = generateRandomString(structure.getAccountNumberLength(), structure.isAccountNumberAlphaNumeric());
        String nationalCheckDigit = generateRandomString(structure.getNationalCheckDigitLength(), structure.isNationalCheckDigitAlphaNumeric());

        // Builder gère la validation auto
        Iban.Builder builder = new Iban.Builder()
                .countryCode(countryCode)
                .bankCode(bankCode)
                .branchCode(branchCode)
                .accountNumber(accountNumber);
        
        // Seulement si le pays a un check digit (ex. FR oui, certains non)
        if (structure.getNationalCheckDigitLength() > 0) {
            builder.nationalCheckDigit(nationalCheckDigit);
        }

        Iban iban = builder.build();
        return iban.toString();
    }

    // Génère une string random (digits ou alphanum) de longueur exacte
    private String generateRandomString(int length, boolean alphaNumeric) {
        if (length <= 0) return "";  // Pas de composant pour ce pays
        
        StringBuilder sb = new StringBuilder(length);
        String chars = alphaNumeric ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" : "0123456789";
        
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // Mapper nationalité -> CountryCode (ajoute-en plus si besoin)
    private CountryCode mapNationaliteToCode(String nationalite) {
        if (nationalite == null || nationalite.isEmpty()) {
            return CountryCode.FR;  // Default FR
        }
        switch (nationalite.toLowerCase()) {
            case "française": return CountryCode.FR;
            case "togolaise": return CountryCode.TG;
            // Ajoute d'autres : ex. case "allemande": return CountryCode.DE;
            default: throw new UnsupportedCountryException("Nationalité non supportée: " + nationalite);
        }
    }
}