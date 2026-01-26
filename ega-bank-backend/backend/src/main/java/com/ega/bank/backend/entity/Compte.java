package com.ega.bank.backend.entity;

import com.ega.bank.backend.enums.TypeCompte;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "comptes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Compte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_compte", nullable = false, unique = true)
    private String numeroCompte;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeCompte typeCompte;

    @Column(name = "date_creation", nullable = false)
    private LocalDate dateCreation;

    @Column(nullable = false)
    private BigDecimal solde;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "compteSource", cascade = CascadeType.ALL)
    private List<Transaction> transactions;
}
