package com.ega.bank.bank_api.dto;

import com.ega.bank.bank_api.entity.Compte;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour l'entité Compte de la société bancaire "Ega"
 * Conforme à l'énoncé : numéro de compte, type, date de création, solde, propriétaire
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteDto {
    
    private Long id;
    
    private String numeroCompte; // Généré automatiquement avec iban4j
    
    @NotNull(message = "Le type de compte est obligatoire")
    private Compte.TypeCompte typeCompte;
    
    private LocalDateTime dateCreation;
    
    // Solde nul à la création selon l'énoncé
    @NotNull(message = "Le solde ne peut pas être null")
    @DecimalMin(value = "0.0", message = "Le solde ne peut pas être négatif")
    private BigDecimal solde = BigDecimal.ZERO;
    
    // Informations du propriétaire
    @NotNull(message = "Le propriétaire du compte est obligatoire")
    private Long proprietaireId;
    
    private String proprietaireNom;
    private String proprietairePrenom;
    private String proprietaireCourriel;
    
    // Nombre de transactions sur ce compte
    private int nombreTransactions;
}