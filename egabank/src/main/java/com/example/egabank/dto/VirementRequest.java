package com.example.egabank.dto;
import lombok.Data;

@Data
public class VirementRequest {
    private String ibanSource;
    private String ibanDestination;
    private Double montant;
}