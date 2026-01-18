package com.iai.ega_bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CompteDto {
    private double balance;
    private double interestRate;
    private double decouvert;
    private long clientId;

}
