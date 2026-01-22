package com.ega.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comptes", uniqueConstraints = {
    @UniqueConstraint(columnNames = "numeroCompte")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Le numéro de compte est obligatoire")
    @Column(nullable = false, unique = true, length = 34)
    private String numeroCompte;
    
    @NotNull(message = "Le type de compte est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TypeCompte typeCompte;
    
    @NotNull(message = "La date de création est obligatoire")
    @Column(nullable = false)
    private LocalDateTime dateCreation;
    
    @NotNull(message = "Le solde est obligatoire")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    @Digits(integer = 15, fraction = 2, message = "Le solde doit avoir au maximum 15 chiffres avant la virgule et 2 après")
    @Column(nullable = false, precision = 17, scale = 2)
    private BigDecimal solde;
    
    @NotNull(message = "Le client est obligatoire")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToMany(mappedBy = "compte", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        if (solde == null) {
            solde = BigDecimal.ZERO;
        }
    }
}

