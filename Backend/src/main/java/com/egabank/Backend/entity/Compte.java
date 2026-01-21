package com.egabank.Backend.entity;

import com.egabank.Backend.entity.enums.TypeCompte;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_compte", unique = true, nullable = false, length = 34)
    private String numeroCompte;

    @NotNull
    @Column(nullable = false)
    private Double solde;

    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompte typeCompte;

    @ManyToOne(optional = false)
    private Client proprietaire;

    public Long getId() {
        return id;
    }

    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public Double getSolde() {
        return solde;
    }

    public void setSolde(Double solde) {
        this.solde = solde;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public TypeCompte getTypeCompte() {
        return typeCompte;
    }

    public void setTypeCompte(TypeCompte typeCompte) {
        this.typeCompte = typeCompte;
    }

    public Client getProprietaire() {
        return proprietaire;
    }

    public void setProprietaire(Client proprietaire) {
        this.proprietaire = proprietaire;
    }
}
