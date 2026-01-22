package com.ega.bank.bank_api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour les virements du client
 * Conforme au cahier des charges : "Faire un virement d'un compte à un autre"
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VirementClientDto {
    
    @NotBlank(message = "Le numéro du compte source est obligatoire")
    private String compteSource;
    
    @NotBlank(message = "Le numéro du compte destinataire est obligatoire")
    private String compteDestinataire;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être positif")
    private BigDecimal montant;
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    private String description;
}