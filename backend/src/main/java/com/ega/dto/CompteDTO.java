package com.ega.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ega.model.TypeCompte;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompteDTO {

    private Long id;

    // Plus besoin de NotBlank : sera généré automatiquement
    private String numeroCompte;

    @NotNull(message = "Type de compte requis")
    private TypeCompte typeCompte;

    private LocalDateTime dateCreation;

    // Plus besoin de NotNull : sera initialisé à 0 automatiquement
    private BigDecimal solde;

    private boolean actif;

    @NotNull(message = "ID client requis")
    private Long clientId;

    private String clientNom;
    private String clientPrenom;
}
