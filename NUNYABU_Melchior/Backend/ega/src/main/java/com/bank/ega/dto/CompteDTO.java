package com.bank.ega.dto;

import com.bank.ega.entity.TypeCompte;

import lombok.Data;

@Data
public class CompteDTO {
    private Long clientId;
    private TypeCompte typeCompte;
}