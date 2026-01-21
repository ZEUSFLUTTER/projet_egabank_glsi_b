/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(unique = true, nullable = false)
    private String nomUtilisateur;

    @NotBlank @Column(nullable = false)
    private String motDePasse;

    @NotBlank @Column(nullable = false)
    private String role;

    public Long getId() { return id; }
    public String getNomUtilisateur() { return nomUtilisateur; }
    public void setNomUtilisateur(String nomUtilisateur) { this.nomUtilisateur = nomUtilisateur; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
