package com.ega.bank.backend.entity;

import com.ega.bank.backend.enums.TypeUtilisateur;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeUtilisateur role;

    @Column(nullable = false)
    private boolean actif = true;

    /**
     * Lien optionnel vers un client.
     * - CLIENT → lié à un Client
     * - ADMIN / AGENT → null
     */
    @OneToOne
    @JoinColumn(name = "client_id", unique = true)
    private Client client;
}