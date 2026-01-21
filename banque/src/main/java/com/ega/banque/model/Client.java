package com.ega.banque.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "clients")
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String numeroCompte;

    private String nom;
    private String prenom;
    private String email;

    
    private double solde;
    private String type;   
    private String statut;

    // AJOUT : Lien vers le compte
    @OneToOne(mappedBy = "proprietaire", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("proprietaire") // Évite les boucles infinies lors de l'envoi vers Angular
    private Compte compte;
}