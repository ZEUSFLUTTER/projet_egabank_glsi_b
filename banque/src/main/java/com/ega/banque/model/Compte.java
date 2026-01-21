package com.ega.banque.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Compte {

    @Id
    @Column(nullable = false)
    private String numeroCompte; // Sert d'identifiant unique (ID)

    private String typeCompte; // Épargne ou Courant
    
    private LocalDate dateCreation;
    
    private Double solde = 0.0;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "client_id")
    private Client proprietaire; // Le client à qui appartient ce compte
}