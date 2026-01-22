package com.maxime.Ega.dto;

import com.maxime.Ega.entity.Client;
import com.maxime.Ega.entity.User;
import com.maxime.Ega.enums.AccountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
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
public class AccountListDto {

    private String accountNumber;

    private AccountType accountType;

    private LocalDateTime createdAt;

    private BigDecimal balance =  BigDecimal.ZERO;


}
