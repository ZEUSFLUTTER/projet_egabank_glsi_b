package com.ega.banking.dto;

import com.ega.banking.model.TypeTransaction;
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

    private String description;

    private Long compteSourceId;

    private String compteSourceNumero;

    private Long compteDestinationId;

    private String compteDestinationNumero;

    private LocalDateTime dateTransaction;

    private BigDecimal soldePrecedent;

    private BigDecimal nouveauSolde;
}
