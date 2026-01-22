package com.ega.bank.bank_api.dto;

import com.ega.bank.bank_api.entity.Transaction;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour l'entité Transaction de la société bancaire "Ega"
 * Conforme à l'énoncé : dépôt, versement, virement
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDto {
    
    private Long id;
    
    @NotNull(message = "Le type de transaction est obligatoire")
    private Transaction.TypeTransaction typeTransaction;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être positif")
    private BigDecimal montant;
    
    private LocalDateTime dateTransaction;
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    private String description;
    
    // Informations du compte
    @NotNull(message = "Le compte est obligatoire")
    private Long compteId;
    private String numeroCompte;
    
    // Pour les virements
    private String compteDestinataire;
    
    // Soldes pour traçabilité
    private BigDecimal soldeAvant;
    private BigDecimal soldeApres;
    
    // Informations du propriétaire du compte
    private String proprietaireNom;
    private String proprietairePrenom;
}