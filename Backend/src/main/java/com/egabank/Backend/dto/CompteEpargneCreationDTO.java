/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.dto;

/**
 *
 * @author HP
 */
public record CompteEpargneCreationDTO(
    String numeroCompte,
    double soldeInitial,
    double tauxInteret
) {}
