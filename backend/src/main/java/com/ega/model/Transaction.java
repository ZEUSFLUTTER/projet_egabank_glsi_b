package com.ega.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Le type de transaction est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeTransaction typeTransaction;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @Digits(integer = 15, fraction = 2, message = "Le montant doit avoir au maximum 15 chiffres avant la virgule et 2 après")
    @Column(nullable = false, precision = 17, scale = 2)
    private BigDecimal montant;
    
    @NotNull(message = "La date de transaction est obligatoire")
    @Column(nullable = false)
    private LocalDateTime dateTransaction;
    
    @NotNull(message = "Le compte est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id", nullable = false)
    private Compte compte;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_destination_id")
    private Compte compteDestination;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    @Column(length = 500)
    private String description;
    
    @PrePersist
    protected void onCreate() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
}

