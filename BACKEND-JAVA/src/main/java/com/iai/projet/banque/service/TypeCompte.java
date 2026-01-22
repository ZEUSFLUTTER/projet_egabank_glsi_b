package com.iai.projet.banque.service;

public enum TypeCompte {
    EPARGNE("Compte Épargne", "EP"),
    COURANT("Compte Courant", "CC");

    private final String libelle;
    private final String code;

    TypeCompte(String libelle, String code) {
        this.libelle = libelle;
        this.code = code;
    }
    /**
     * Récupère le TypeCompte à partir d'une chaîne de caractères
     * @param value La valeur à convertir (insensible à la casse)
     * @return Le TypeCompte correspondant
     * @throws IllegalArgumentException si le type n'existe pas
     */
    public static TypeCompte fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de compte ne peut pas être vide");
        }

        for (TypeCompte type : TypeCompte.values()) {
            if (type.name().equalsIgnoreCase(value.trim()) ||
                    type.code.equalsIgnoreCase(value.trim())) {
                return type;
            }
        }

        throw new IllegalArgumentException(
                "Type de compte invalide: " + value + ". Valeurs acceptées: EPARGNE, COURANT"
        );
    }
}
