package com.iai.projet.banque.models;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.io.Serializable;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ClientDTO implements Serializable {

    private Long id;

    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String sexe;
    private String adresse;
    private String telephone;
    private String email;
    private String courriel;
    private String nationalite;
    private String typeCompte;
    private String idCompteSource;
    private String idCompteDestination;
    private String solde;
    private String username;
    private String password;
    private String numeroCompte;




}
