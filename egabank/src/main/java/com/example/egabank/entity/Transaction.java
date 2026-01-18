package com.example.egabank.entity;

import jakarta.persistence.*;
import lombok.*; // Vérifie bien l'import de lombok
import java.time.LocalDateTime;

@Entity
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder // C'est cette annotation qui crée la méthode .builder()
public class Transaction {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TypeTransaction typeTransaction;
    
    private Double montant;
    private LocalDateTime dateTransaction; // Renamed from 'date' to match frontend expectations
    private String description; // Added description field
    
    @ManyToOne
    private Compte compteSource;
    
    @ManyToOne
    private Compte compteDestination;
    
    @Enumerated(EnumType.STRING)
    private Mode modeOperation;
    
    @Enumerated(EnumType.STRING)
    private Statut statut;
}