package com.ega.bank.entity;

/**
 * Énumération des types de compte bancaire
 */
public enum TypeCompte {
    COMPTE_COURANT("Compte Courant"),
    COMPTE_EPARGNE("Compte Épargne");
    
    private final String libelle;
    
    TypeCompte(String libelle) {
        this.libelle = libelle;
    }
    
    public String getLibelle() {
        return libelle;
    }
}