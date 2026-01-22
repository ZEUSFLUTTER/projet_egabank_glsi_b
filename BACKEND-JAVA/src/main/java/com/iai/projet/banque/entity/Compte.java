package com.iai.projet.banque.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

import org.iban4j.CountryCode;
import org.iban4j.Iban;

import java.util.Date;

@Entity
@Table(name = "COMPTES")
public class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NUMERO_COMPTE")
    private String numeroCompte;

    @Column(name = "DATE_CREATION")
    private LocalDate dateCreation;

    @Column(name = "TYPE_COMPTE")
    private String typeCompte;

    @Column(name = "SOLDE_COMPTE")
    private Double soldeCompte = 0.0;

    @Column(name = "ID_CLIENT")
    private Long idClient;

//    public String genererIBANPersonnalise(Long clientId) {
//        String codeBanque = "00001";   // 5 chiffres
//        String codeGuichet = "00001";  // 5 chiffres
//
//        // Calcul puis limitation à 11 chiffres maximum (99999999999)
//        long rawAccountNum = clientId * 100000 + System.currentTimeMillis() % 100000;
//        long accountNum = rawAccountNum % 100000000000L;  // Modulo avec 11 zéros
//
//        String accountNumber = String.format("%011d", accountNum);
//
//        // Construction de l'IBAN pour FR
//        Iban iban = new Iban.Builder()
//                .countryCode(CountryCode.FR)
//                .bankCode(codeBanque)
//                .branchCode(codeGuichet)
//                .accountNumber(accountNumber)
//                .build();
//
//        return iban.toString();
//
//    }

    // Génération automatique du numéro de compte avant la persistance
    @PrePersist
    public void generateNumeroCompte() {
        if (this.numeroCompte == null || this.numeroCompte.isEmpty()) {
            this.numeroCompte = genererIBAN();
        }
        if (this.dateCreation == null) {
            this.dateCreation = LocalDate.now();
        }
        if (this.soldeCompte == null) {
            this.soldeCompte = 0.0;
        }
    }

    /**
     * Génère un numéro IBAN aléatoire pour le Togo
     * Format: TG53 TG00 0000 0000 0000 0000 0000
     */
    private String genererIBAN() {
        String iban="";
        try {
            iban ="EGA"+"TG"+ idClient + genererNumeroAleatoire(5);

            return iban.toString();
        } catch (Exception e) {
        }
        return iban;
    }

    /**
     * Génère un numéro aléatoire de N chiffres
     */
    private String genererNumeroAleatoire(int length) {
        StringBuilder numero = new StringBuilder();
        for (int i = 0; i < length; i++) {
            numero.append((int) (Math.random() * 10));
        }
        return numero.toString();
    }

    public Compte() {
    }

    public Compte(String numeroCompte, LocalDate dateCreation, String typeCompte, Double soldeCompte, Long idClient) {
        this.numeroCompte = numeroCompte;
        this.dateCreation = dateCreation;
        this.typeCompte = typeCompte;
        this.soldeCompte = soldeCompte;
        this.idClient = idClient;
    }


    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getTypeCompte() {
        return typeCompte;
    }

    public void setTypeCompte(String typeCompte) {
        this.typeCompte = typeCompte;
    }

    public Double getSoldeCompte() {
        return soldeCompte;
    }

    public void setSoldeCompte(Double soldeCompte) {
        this.soldeCompte = soldeCompte;
    }

    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }
}
