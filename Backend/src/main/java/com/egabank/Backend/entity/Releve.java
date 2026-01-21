package com.egabank.Backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "releves")
public class Releve {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String numeroCompte;
    
    @Column(nullable = false)
    private double montant;
    
    @Column(nullable = false)
    private String type; // DEPOT, RETRAIT, VIREMENT
    
    @Column(nullable = false)
    private String libelle;
    
    @Column(nullable = false)
    private LocalDateTime dateOperation;
    
    private double soldeApres;

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public LocalDateTime getDateOperation() {
        return dateOperation;
    }

    public void setDateOperation(LocalDateTime dateOperation) {
        this.dateOperation = dateOperation;
    }

    public double getSoldeApres() {
        return soldeApres;
    }

    public void setSoldeApres(double soldeApres) {
        this.soldeApres = soldeApres;
    }
}