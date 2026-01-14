package com.backend.ega.entities.enums;

/**
 * Énumération des types de comptes disponibles
 * La banque met à disposition deux types de comptes :
 * - EPARGNE : Compte d'épargne (pour économiser)
 * - COURANT : Compte courant (pour les opérations courantes)
 */
public enum AccountType {
    EPARGNE("Compte Épargne"),
    COURANT("Compte Courant");

    private final String label;

    AccountType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
