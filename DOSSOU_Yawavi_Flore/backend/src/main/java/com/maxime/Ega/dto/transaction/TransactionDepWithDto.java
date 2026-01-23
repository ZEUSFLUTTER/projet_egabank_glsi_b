package com.maxime.Ega.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDepWithDto {
    private BigDecimal amount;
    private AccountDepWithDto accountNumber;
}
