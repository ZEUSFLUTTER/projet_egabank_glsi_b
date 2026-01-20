package com.ega.bank.dto;

import com.ega.bank.entity.TypeCompte;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompteDTO {
    private Long id;
    private String numeroCompte;
    private TypeCompte typeCompte;
    private BigDecimal solde;
    private LocalDate dateCreation;
    private Long clientId;
    private String nomProprietaire;
    private Boolean actif;
    
    // Pour compte courant
    private BigDecimal decouvertAutorise;
    
    // Pour compte épargne
    private Double tauxInteret;
}