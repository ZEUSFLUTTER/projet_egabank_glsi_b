package com.example.egabank.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Compte {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String numeroCompte;
    
    @Enumerated(EnumType.STRING)
    private TypeCompte typeCompte; // COURANT, EPARGNE
    
    private LocalDateTime dateCreation;
    private Double solde;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonBackReference
    private Client proprietaire;
}
