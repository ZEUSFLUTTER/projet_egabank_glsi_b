package com.ega.bank.ressources;

import org.iban4j.CountryCode;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Structure IBAN personnalisée pour différents pays
 */
public class MyIbanStructure {

    private final String countryCode;
    private final int length;
    private final String regexPattern;
    private final int bankCodeLength;
    private final int branchCodeLength;
    private final int accountNumberLength;
    private final int nationalCheckDigitLength;
    private final boolean bankCodeAlphaNumeric;
    private final boolean branchCodeAlphaNumeric;
    private final boolean accountNumberAlphaNumeric;
    private final boolean nationalCheckDigitAlphaNumeric;

    // Map statique des structures par pays
    private static final Map<CountryCode, MyIbanStructure> STRUCTURES = new HashMap<>();

    static {
        // France (FR) - 27 caractères
        // Format: FR + 2 check + 5 bank + 5 branch + 11 account + 2 national check
        STRUCTURES.put(CountryCode.FR, new MyIbanStructure(
                "FR",
                27,
                "FR\\d{25}",
                5,  // bankCodeLength
                5,  // branchCodeLength
                11, // accountNumberLength
                2,  // nationalCheckDigitLength
                false, // bankCode numérique seulement
                false, // branchCode numérique seulement
                false, // accountNumber numérique seulement
                false  // nationalCheckDigit numérique seulement
        ));

        // Togo (TG) - 28 caractères
        // Format: TG + 2 check + 2 bank + 2 branch + 20 account
        STRUCTURES.put(CountryCode.TG, new MyIbanStructure(
                "TG",
                28,
                "TG\\d{26}",
                2,  // bankCodeLength
                2,  // branchCodeLength
                20, // accountNumberLength
                0,  // pas de national check digit pour TG
                false, // numérique
                false, // numérique
                false, // numérique
                false
        ));

        // Vous pouvez ajouter d'autres pays ici
        // Allemagne (DE) - 22 caractères
        STRUCTURES.put(CountryCode.DE, new MyIbanStructure(
                "DE",
                22,
                "DE\\d{20}",
                8,  // bankCodeLength
                0,  // pas de branchCode
                10, // accountNumberLength
                0,  // pas de national check digit
                false,
                false,
                false,
                false
        ));
    }

    // Constructeur complet
    public MyIbanStructure(String countryCode, int length, String regexPattern,
                          int bankCodeLength, int branchCodeLength, 
                          int accountNumberLength, int nationalCheckDigitLength,
                          boolean bankCodeAlphaNumeric, boolean branchCodeAlphaNumeric,
                          boolean accountNumberAlphaNumeric, boolean nationalCheckDigitAlphaNumeric) {
        this.countryCode = Objects.requireNonNull(countryCode, "countryCode ne peut pas être null");
        this.length = length;
        this.regexPattern = Objects.requireNonNull(regexPattern, "regexPattern ne peut pas être null");
        this.bankCodeLength = bankCodeLength;
        this.branchCodeLength = branchCodeLength;
        this.accountNumberLength = accountNumberLength;
        this.nationalCheckDigitLength = nationalCheckDigitLength;
        this.bankCodeAlphaNumeric = bankCodeAlphaNumeric;
        this.branchCodeAlphaNumeric = branchCodeAlphaNumeric;
        this.accountNumberAlphaNumeric = accountNumberAlphaNumeric;
        this.nationalCheckDigitAlphaNumeric = nationalCheckDigitAlphaNumeric;
    }

    /**
     * Récupère la structure IBAN pour un pays donné
     */
    public static MyIbanStructure forCountry(CountryCode countryCode) {
        return STRUCTURES.get(countryCode);
    }

    // Getters
    public String getCountryCode() {
        return countryCode;
    }

    public int getLength() {
        return length;
    }

    public String getRegexPattern() {
        return regexPattern;
    }

    public int getBankCodeLength() {
        return bankCodeLength;
    }

    public int getBranchCodeLength() {
        return branchCodeLength;
    }

    public int getAccountNumberLength() {
        return accountNumberLength;
    }

    public int getNationalCheckDigitLength() {
        return nationalCheckDigitLength;
    }

    public boolean isBankCodeAlphaNumeric() {
        return bankCodeAlphaNumeric;
    }

    public boolean isBranchCodeAlphaNumeric() {
        return branchCodeAlphaNumeric;
    }

    public boolean isAccountNumberAlphaNumeric() {
        return accountNumberAlphaNumeric;
    }

    public boolean isNationalCheckDigitAlphaNumeric() {
        return nationalCheckDigitAlphaNumeric;
    }

    @Override
    public String toString() {
        return "MyIbanStructure{" +
                "countryCode='" + countryCode + '\'' +
                ", length=" + length +
                ", bankCodeLength=" + bankCodeLength +
                ", branchCodeLength=" + branchCodeLength +
                ", accountNumberLength=" + accountNumberLength +
                ", nationalCheckDigitLength=" + nationalCheckDigitLength +
                '}';
    }
}