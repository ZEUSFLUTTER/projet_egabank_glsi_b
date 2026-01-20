package com.ega.bank.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;
    
    @Column(nullable = false)
    private LocalDateTime dateTransaction;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_id", nullable = false)
    private Compte compte;
    
    @Column(length = 34)
    private String compteBeneficiaire; // Pour les virements (numéro IBAN du bénéficiaire)
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    @Column(length = 200)
    private String description;
    
    @Column(nullable = false)
    private BigDecimal soldeApresTransaction;
    
    @PrePersist
    protected void onCreate() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
}