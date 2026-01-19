package com.example.egabank.dto;
import lombok.Data;
import java.time.LocalDate;
import com.example.egabank.entity.TypeCompte;

@Data
public class ClientDTO {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String password; // Changé de motDePasse à password
    private String adresse;
    private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
    private TypeCompte typeCompte; // COURANT ou EPARGNE
}