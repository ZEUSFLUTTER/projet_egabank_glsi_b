package com.maxime.Ega.dto.transaction;

import com.maxime.Ega.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HistoriqueTransactionDto {

    private LocalDateTime transactionDate;
    private TransactionType transactionType;
    private BigDecimal amount;
    private String description;
    private HistoriqueTransAccountDto accountNumber;
}
