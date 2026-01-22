package com.maxime.Ega.dto;

import com.maxime.Ega.enums.AccountType;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDto {

    private AccountType  accountType;
    private ClientDto client;


}
