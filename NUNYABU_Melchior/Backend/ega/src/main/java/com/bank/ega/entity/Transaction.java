package com.bank.ega.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeTransaction type;

    @Column(nullable = false)
    private Double montant;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateTransaction = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "compte_source_id")
    private Compte compteSource;

    @ManyToOne
    @JoinColumn(name = "compte_destination_id")
    private Compte compteDestination;
    
    @Enumerated(EnumType.STRING)
    private SourceDepot source; // Pour les dépôts
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String statut = "COMPLETE"; // COMPLETE, PENDING, FAILED
}

