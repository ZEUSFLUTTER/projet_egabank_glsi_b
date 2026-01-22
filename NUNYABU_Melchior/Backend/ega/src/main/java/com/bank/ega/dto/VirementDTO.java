package com.bank.ega.dto;

import lombok.Data;

@Data
public class VirementDTO {
    private String numeroSource;
    private String numeroDestination;
    private Double montant;
}
