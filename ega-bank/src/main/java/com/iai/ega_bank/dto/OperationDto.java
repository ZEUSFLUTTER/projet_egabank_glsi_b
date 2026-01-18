package com.iai.ega_bank.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class OperationDto {
    private String numCompteSource;
    private String numCompteDestination;
    private double amount;
    private Date operationDate;


}
