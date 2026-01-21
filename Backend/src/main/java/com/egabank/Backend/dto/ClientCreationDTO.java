/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.dto;

import com.egabank.Backend.entity.enums.Sexe;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 *
 * @author HP
 */
public record ClientCreationDTO (
    @NotBlank String nom,
    @NotBlank String prenom,
    @NotNull LocalDate dateNaissance,
    @NotNull Sexe sexe,
    @NotBlank String adresse,
    @NotBlank String numeroTelephone,
    @Email @NotBlank String courriel,
    @NotBlank String nationalite,
    @NotBlank @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères") String motDePasse
){}
