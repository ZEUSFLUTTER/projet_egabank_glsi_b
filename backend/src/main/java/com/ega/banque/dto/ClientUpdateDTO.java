package com.ega.banque.dto;

import java.time.LocalDate;

public class ClientUpdateDTO {

    private String nom;
    private String prenom;
    private String adresse;
    private String telephone;
    private String email;
    private String nationalite;
    private LocalDate dateNaissance;
    private String sexe;

    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getAdresse() { return adresse; }
    public String getTelephone() { return telephone; }
    public String getEmail() { return email; }
    public String getNationalite() { return nationalite; }
    public LocalDate getDateNaissance() { return dateNaissance; }
    public String getSexe() { return sexe; }
}
