package com.bank.ega.dto;

import com.bank.ega.entity.TypeTransaction;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private TypeTransaction type;
    private Double montant;
    private LocalDateTime dateTransaction;
    private String compteSource;
    private String compteDestination;
    private String sourceDepot; // si applicable, comme MOBILE_MONEY
}
