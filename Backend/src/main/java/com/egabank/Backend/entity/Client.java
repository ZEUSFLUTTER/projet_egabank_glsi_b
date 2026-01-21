/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.entity;

import com.egabank.Backend.entity.enums.Sexe;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "clients")
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false)
    private String nom;

    @NotBlank @Column(nullable = false)
    private String prenom;

    @NotNull @Column(nullable = false)
    private LocalDate dateNaissance;

    @NotNull @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Sexe sexe;

    @NotBlank @Column(nullable = false)
    private String adresse;

    @NotBlank @Column(nullable = false, unique = true)
    private String numeroTelephone;

    @Email @NotBlank @Column(nullable = false, unique = true)
    private String courriel;

    @NotBlank @Column(nullable = false)
    private String nationalite;

    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    public Long getId() { return id; }
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
    public String getNumeroTelephone() { return numeroTelephone; }
    public void setNumeroTelephone(String numeroTelephone) { this.numeroTelephone = numeroTelephone; }
    public String getCourriel() { return courriel; }
    public void setCourriel(String courriel) { this.courriel = courriel; }
    public String getNationalite() { return nationalite; }
    public void setNationalite(String nationalite) { this.nationalite = nationalite; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public LocalDateTime getDateCreation() { return dateCreation; }
}
