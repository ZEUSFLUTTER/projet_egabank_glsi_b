package com.egabank.back.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_transaction", nullable = false, columnDefinition = "ENUM('DEPOT','RETRAIT','VIREMENT')")
    private TypeTransaction typeTransaction;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;
    
    @Column(name = "date_transaction")
    private LocalDateTime dateTransaction;
    
    @ManyToOne
    @JoinColumn(name = "compte_source_id")
    private Account compteSource;
    
    @ManyToOne
    @JoinColumn(name = "compte_destination_id")
    private Account compteDestination;
    
    @Column(length = 255)
    private String description;
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TypeTransaction getTypeTransaction() { return typeTransaction; }
    public void setTypeTransaction(TypeTransaction typeTransaction) { this.typeTransaction = typeTransaction; }
    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }
    public LocalDateTime getDateTransaction() { return dateTransaction; }
    public void setDateTransaction(LocalDateTime dateTransaction) { this.dateTransaction = dateTransaction; }
    public Account getCompteSource() { return compteSource; }
    public void setCompteSource(Account compteSource) { this.compteSource = compteSource; }
    public Account getCompteDestination() { return compteDestination; }
    public void setCompteDestination(Account compteDestination) { this.compteDestination = compteDestination; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    @PrePersist
    protected void onCreate() {
        dateTransaction = LocalDateTime.now();
    }
    
    // ENUM PUBLIC ET STATIC
    public static enum TypeTransaction {
        DEPOT, RETRAIT, VIREMENT
    }
}