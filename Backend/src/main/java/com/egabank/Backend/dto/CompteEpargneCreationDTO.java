/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 *
 * @author HP
 */
public record CompteEpargneCreationDTO (
    @NotNull Long idClient,
    Double tauxInteret
){}
