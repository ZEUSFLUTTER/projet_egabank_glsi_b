/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.entity;

import com.egabank.Backend.entity.enums.TypeTransaction;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "transactions")
public class Transaction {
     @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateOperation = LocalDateTime.now();

    @NotNull @Column(nullable = false)
    private Double montant;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private TypeTransaction typeTransaction;

    @Column(nullable = false)
    private String libelle;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "compte_source_id")
    private Compte compteSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "compte_destination_id")
    private Compte compteDestination;

    public Long getId() { return id; }
    public LocalDateTime getDateOperation() { return dateOperation; }
    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }
    public TypeTransaction getTypeTransaction() { return typeTransaction; }
    public void setTypeTransaction(TypeTransaction typeTransaction) { this.typeTransaction = typeTransaction; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public Compte getCompteSource() { return compteSource; }
    public void setCompteSource(Compte compteSource) { this.compteSource = compteSource; }
    public Compte getCompteDestination() { return compteDestination; }
    public void setCompteDestination(Compte compteDestination) { this.compteDestination = compteDestination; }
}
