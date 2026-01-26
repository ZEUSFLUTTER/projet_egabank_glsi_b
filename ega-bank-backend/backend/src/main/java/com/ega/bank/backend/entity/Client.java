package com.ega.bank.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor //Constructeur sans argument.
@AllArgsConstructor //Constructeur avec tous les champs de la classe
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaissance;

    @Column(nullable = false)
    private String sexe;

    @Column(nullable = false)
    private String adresse;

    @Column(name = "telephone", nullable = false)
    private String numeroTelephone;

    @Column(nullable = false, unique = true)
    private String courriel;

    @Column(nullable = false)
    private String nationalite;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Compte> comptes;
}
