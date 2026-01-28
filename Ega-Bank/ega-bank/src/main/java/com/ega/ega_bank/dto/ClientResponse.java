package com.ega.ega_bank.dto;

import com.ega.ega_bank.entite.enums.Role;
import com.ega.ega_bank.entite.enums.Sexe;
import java.time.LocalDate;

public class ClientResponse {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private Sexe sexe;
    private String adresse;
    private String telephone;
    private String courriel;
    private String nationalite;
    private Role role;
    private int nombreComptes;

    // Constructeurs
    public ClientResponse() {}

    public ClientResponse(Long id, String nom, String prenom, LocalDate dateNaissance, 
                         Sexe sexe, String adresse, String telephone, String courriel, 
                         String nationalite, Role role, int nombreComptes) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.telephone = telephone;
        this.courriel = courriel;
        this.nationalite = nationalite;
        this.role = role;
        this.nombreComptes = nombreComptes;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public int getNombreComptes() { return nombreComptes; }
    public void setNombreComptes(int nombreComptes) { this.nombreComptes = nombreComptes; }
}