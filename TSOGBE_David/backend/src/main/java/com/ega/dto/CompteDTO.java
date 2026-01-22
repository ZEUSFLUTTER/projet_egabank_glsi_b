package com.ega.dto;

import com.ega.model.TypeCompte;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteDTO {
    private Long id;
    
    private String numeroCompte;
    
    @NotNull(message = "Le type de compte est obligatoire")
    private TypeCompte typeCompte;
    
    private LocalDateTime dateCreation;
    
    private BigDecimal solde;
    
    @NotNull(message = "L'ID du client est obligatoire")
    private Long clientId;
    
    private String clientNom;
    private String clientPrenom;
}

