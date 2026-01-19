package com.example.egabank.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String adresse;
    private String telephone;
    @Column(unique = true)
    private String email;
    private String nationalite;
    private String motDePasse;
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime dateCreation;
    private Boolean premiereConnexion = true; // Nouveau champ

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Compte> comptes;
}
