package com.ega.banque.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être valide")
    private String email;
    
    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(min = 3, message = "Le nom d'utilisateur doit contenir au moins 3 caractères")
    private String username;
    
    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
    
    private String telephone;
    private String adresse;
    private String sexe;
    private String nationalite;
    private String dateNaissance;

    // Getters
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getTelephone() { return telephone; }
    public String getAdresse() { return adresse; }
    public String getSexe() { return sexe; }
    public String getNationalite() { return nationalite; }
    public String getDateNaissance() { return dateNaissance; }

    // Setters
    public void setNom(String nom) { this.nom = nom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public void setAdresse(String adresse) { this.adresse = adresse; }
    public void setSexe(String sexe) { this.sexe = sexe; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }
    public void setDateNaissance(String dateNaissance) { this.dateNaissance = dateNaissance; }
}
