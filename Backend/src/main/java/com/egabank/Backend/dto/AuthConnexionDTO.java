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
public record AuthConnexionDTO (
    @NotBlank String nomUtilisateur,
    @NotBlank String motDePasse
){}
