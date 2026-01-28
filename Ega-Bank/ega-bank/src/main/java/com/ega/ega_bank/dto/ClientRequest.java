package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.Sexe;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class ClientRequest {

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotNull
    private LocalDate dateNaissance;

    @NotNull
    private Sexe sexe;

    @NotBlank
    private String adresse;

    @NotBlank
    private String telephone;

    @Email
    @NotBlank
    private String courriel;

    @NotBlank
    private String nationalite;

    // Champ optionnel pour réinitialiser le mot de passe lors d'une mise à jour
    private String password;

    // --- Constructeurs ---
    public ClientRequest() {
    }

    public ClientRequest(String nom, String prenom, LocalDate dateNaissance, Sexe sexe,
                         String adresse, String telephone, String courriel, String nationalite, String password) {
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.telephone = telephone;
        this.courriel = courriel;
        this.nationalite = nationalite;
        this.password = password;
    }

    // --- Getters et Setters ---
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }

    public Sexe getSexe() { return sexe; }
    public void setSexe(Sexe sexe) { this.sexe = sexe; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getCourriel() { return courriel; }
    public void setCourriel(String courriel) { this.courriel = courriel; }

    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // --- toString ---
    @Override
    public String toString() {
        return "ClientRequest{" +
                "nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", dateNaissance=" + dateNaissance +
                ", sexe=" + sexe +
                ", adresse='" + adresse + '\'' +
                ", telephone='" + telephone + '\'' +
                ", courriel='" + courriel + '\'' +
                ", nationalite='" + nationalite + '\'' +
                ", password='" + (password != null ? "***" : null) + '\'' +
                '}';
    }
}
