package com.bank.ega.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "compte")
public class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroCompte;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompte typeCompte;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(nullable = false)
    private Double solde = 0.0;

    @Column(nullable = false)
    private String statut = "ACTIF"; // ACTIF, SUSPENDU, FERME

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    @JsonBackReference
    private Client client;

    @OneToMany(mappedBy = "compteSource", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Transaction> transactionsSortantes;

    @OneToMany(mappedBy = "compteDestination", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Transaction> transactionsEntrantes;
}