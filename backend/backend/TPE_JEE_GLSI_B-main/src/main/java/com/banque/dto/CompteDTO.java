package com.banque.dto;

import com.banque.entity.TypeCompte;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompteDTO {
    private Long id;
    private String numCompte;
    
    @NotNull(message = "Le type de compte est requis")
    private TypeCompte typeCompte;
    
    private LocalDate dateCreation;
    
    @PositiveOrZero(message = "Le solde doit être positif ou nul")
    private BigDecimal solde;
    
    @NotNull(message = "L'ID du client est requis")
    private Long clientId;
}
