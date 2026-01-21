package com.iai.ega_bank.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class resumeCompteDto {
    private Long clientId;
    private String numCompte;
    private double balance;
}
