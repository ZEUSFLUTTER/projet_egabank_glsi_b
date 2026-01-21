/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.dto;

import jakarta.validation.constraints.*;

/**
 *
 * @author HP
 */
public record VirementDTO (
    @NotBlank String numeroCompteSource,
    @NotBlank String numeroCompteDestination,
    @NotNull @Positive Double montant,
    @NotBlank String libelle
){}
