package com.ega.ega_bank.entite;

import com.ega.ega_bank.entite.enums.TypeOperation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TypeOperation type; // DEPOT, RETRAIT, VIREMENT

    @NotNull
    @Positive
    private BigDecimal montant;

    @NotNull
    private LocalDateTime dateOperation = LocalDateTime.now(); // valeur par défaut

    @ManyToOne
    @JoinColumn(name = "compte_source_id")
    @JsonIgnore
    private Compte compteSource;

    @ManyToOne
    @JoinColumn(name = "compte_destination_id")
    @JsonIgnore
    private Compte compteDestination;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client; // lien direct avec le client

    private String description;

    // --- Constructeurs ---
    public Transaction() {
    }

    public Transaction(TypeOperation type, BigDecimal montant, LocalDateTime dateOperation,
                       Compte compteSource, Compte compteDestination, Client client, String description) {
        this.type = type;
        this.montant = montant;
        this.dateOperation = dateOperation != null ? dateOperation : LocalDateTime.now();
        this.compteSource = compteSource;
        this.compteDestination = compteDestination;
        this.client = client;
        this.description = description;
    }

    // --- Getters et Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TypeOperation getType() { return type; }
    public void setType(TypeOperation type) { this.type = type; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public LocalDateTime getDateOperation() { return dateOperation; }
    public void setDateOperation(LocalDateTime dateOperation) { this.dateOperation = dateOperation; }

    public Compte getCompteSource() { return compteSource; }
    public void setCompteSource(Compte compteSource) { this.compteSource = compteSource; }

    public Compte getCompteDestination() { return compteDestination; }
    public void setCompteDestination(Compte compteDestination) { this.compteDestination = compteDestination; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // --- toString ---
    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", type=" + type +
                ", montant=" + montant +
                ", dateOperation=" + dateOperation +
                ", compteSource=" + (compteSource != null ? compteSource.getId() : null) +
                ", compteDestination=" + (compteDestination != null ? compteDestination.getId() : null) +
                ", client=" + (client != null ? client.getId() : null) +
                ", description='" + description + '\'' +
                '}';
    }
}
