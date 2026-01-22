package com.ega.bank.bank_api.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperationDto {
    
    @NotBlank(message = "Le numéro de compte est obligatoire")
    private String numeroCompte;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être positif")
    private BigDecimal montant;
    
    @Size(max = 200, message = "La description ne peut pas dépasser 200 caractères")
    private String description;
}