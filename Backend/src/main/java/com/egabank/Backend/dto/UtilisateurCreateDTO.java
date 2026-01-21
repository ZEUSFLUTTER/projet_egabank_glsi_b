/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 *
 * @author HP
 */
public record UtilisateurCreateDTO (
    @NotBlank(message = "Le nom d'utilisateur est requis")
    String nomUtilisateur,
    @NotBlank(message = "Le mot de passe est requis")
    String motDePasse,
    @NotBlank(message = "Le rôle est requis")
    String role
){}
