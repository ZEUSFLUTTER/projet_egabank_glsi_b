package com.iai.projet.banque.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "CLIENTS")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "NOM")
    private String nom;
    @Column(name = "PRENOMS")
    private String prenom;
    @Column(name = "DATE_NAISSANCE")
    private Date dateNaissance;
    @Column(name = "SEXE")
    private String sexe;
    @Column(name = "ADRESSE")
    private String adresse;
    @Column(name = "TELEPHONE")
    private String telephone;
    @Column(name = "COURIEL")
    private String couriel;
    @Column(name = "NATIONALITE")
    private String nationalite;

    public Client() {
    }

    public Client(Long id, String nom, String prenom, Date date_naissance, String sexe, String adresse, String telephone,
                  String couriel, String nationalite) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = date_naissance;
        this.sexe = sexe;
        this.adresse = adresse;
        this.telephone = telephone;
        this.couriel = couriel;
        this.nationalite = nationalite;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Date getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(Date dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telepnone) {
        this.telephone = telepnone;
    }

    public String getCouriel() {
        return couriel;
    }

    public void setCouriel(String couriel) {
        this.couriel = couriel;
    }

    public String getNationalite() {
        return nationalite;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }
}
