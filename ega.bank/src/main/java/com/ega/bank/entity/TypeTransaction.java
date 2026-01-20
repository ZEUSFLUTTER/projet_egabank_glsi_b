package com.ega.bank.entity;

/**
 * Énumération des types de transaction
 */
public enum TypeTransaction {
    VERSEMENT("Versement"),
    RETRAIT("Retrait"),
    VIREMENT("Virement");
    
    private final String libelle;
    
    TypeTransaction(String libelle) {
        this.libelle = libelle;
    }
    
    public String getLibelle() {
        return libelle;
    }
}