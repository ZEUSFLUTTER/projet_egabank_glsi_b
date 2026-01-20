package com.ega.bank.dto;

import com.ega.bank.entity.TypeTransaction;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private TypeTransaction typeTransaction;
    private BigDecimal montant;
    private LocalDateTime dateTransaction;
    private String numeroCompte;
    private String compteBeneficiaire;
    private String description;
    private BigDecimal soldeApresTransaction;
}