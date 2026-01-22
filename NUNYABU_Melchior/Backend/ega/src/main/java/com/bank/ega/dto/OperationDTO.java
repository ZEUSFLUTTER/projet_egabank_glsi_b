package com.bank.ega.dto;

import lombok.Data;

@Data
public class OperationDTO {
    private String numeroCompte;
    private Double montant;
    private String source;       // pour virement
    private String destination;  // pour virement
}
