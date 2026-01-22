package com.iai.projet.banque.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "OPERATIONS")
public class Operation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "TYPE_OPERATION")
    private String typeOperation;

    @Column(name = "MONTANT")
    private Double montant;

    @Column(name = "DATE_OPERATION")
    private LocalDate dateOperation;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "COMPTE_SOURCE_ID")
    private Long compteSourceId;

    @Column(name = "COMPTE_DESTINATION_ID")
    private Long compteDestinationId;


    public Operation() {
    }

    public Operation(Long id, String typeOperation, Double montant, LocalDate dateOperation, String description, Long compteSourceId, Long compteDestinationId) {
        this.id = id;
        this.typeOperation = typeOperation;
        this.montant = montant;
        this.dateOperation = dateOperation;
        this.description = description;
        this.compteSourceId = compteSourceId;
        this.compteDestinationId = compteDestinationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeOperation() {
        return typeOperation;
    }

    public void setTypeOperation(String typeOperation) {
        this.typeOperation = typeOperation;
    }

    public Double getMontant() {
        return montant;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public LocalDate getDateOperation() {
        return dateOperation;
    }

    public void setDateOperation(LocalDate dateOperation) {
        this.dateOperation = dateOperation;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCompteSourceId() {
        return compteSourceId;
    }

    public void setCompteSourceId(Long compteSourceId) {
        this.compteSourceId = compteSourceId;
    }

    public Long getCompteDestinationId() {
        return compteDestinationId;
    }

    public void setCompteDestinationId(Long compteDestinationId) {
        this.compteDestinationId = compteDestinationId;
    }
}
