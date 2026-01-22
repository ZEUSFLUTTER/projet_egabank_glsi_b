package com.iai.projet.banque.service;

public enum TypeOperation {
    VERSEMENT("Depot", "DEP"),
    RETRAIT("Retrait", "RET"),
    VIREMENT("Virement", "TRS");

    private final String libelle;
    private final String code;

    TypeOperation(String libelle, String code) {
        this.libelle = libelle;
        this.code = code;
    }
    /**
     * Récupère le TypeCompte à partir d'une chaîne de caractères
     * @param value La valeur à convertir (insensible à la casse)
     * @return Le TypeCompte correspondant
     * @throws IllegalArgumentException si le type n'existe pas
     */
    public static TypeOperation fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Le type de compte ne peut pas être vide");
        }

        for (TypeOperation type : TypeOperation.values()) {
            if (type.name().equalsIgnoreCase(value.trim()) ||
                    type.code.equalsIgnoreCase(value.trim())) {
                return type;
            }
        }

        throw new IllegalArgumentException(
                "Type d'operation invalide: " + value + ". Valeurs acceptées: EPARGNE, COURANT"
        );
    }
}
