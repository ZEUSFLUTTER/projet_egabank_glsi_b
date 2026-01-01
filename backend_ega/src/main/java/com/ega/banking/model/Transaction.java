package com.ega.banking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_date", columnList = "dateTransaction")
})
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
    @Column(nullable = false)
    private TypeTransaction type;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal montant;
    
    @Size(max = 255, message = "La description ne doit pas dépasser 255 caractères")
    @Column(length = 255)
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_source_id")
    private Compte compteSource;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compte_destination_id")
    private Compte compteDestination;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateTransaction;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal soldePrecedent;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal nouveauSolde;
    
    @PrePersist
    public void prePersist() {
        if (dateTransaction == null) {
            dateTransaction = LocalDateTime.now();
        }
    }
}
