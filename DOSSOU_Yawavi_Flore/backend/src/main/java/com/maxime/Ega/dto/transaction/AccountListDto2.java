package com.maxime.Ega.dto.transaction;

import com.maxime.Ega.dto.ClientListDto;
import com.maxime.Ega.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountListDto2 {

    private String accountNumber;

    private AccountType accountType;

    private ClientListDto client;
}
