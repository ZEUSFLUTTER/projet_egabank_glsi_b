package com.ega.dto;

import com.ega.model.TypeTransaction;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    
    @NotNull(message = "Le type de transaction est obligatoire")
    private TypeTransaction typeTransaction;
    
    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    @Digits(integer = 15, fraction = 2, message = "Le montant doit avoir au maximum 15 chiffres avant la virgule et 2 après")
    private BigDecimal montant;
    
    private LocalDateTime dateTransaction;
    
    @NotNull(message = "L'ID du compte est obligatoire")
    private Long compteId;
    
    private String compteNumero;
    
    private Long compteDestinationId;
    
    private String compteDestinationNumero;
    
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;
}

