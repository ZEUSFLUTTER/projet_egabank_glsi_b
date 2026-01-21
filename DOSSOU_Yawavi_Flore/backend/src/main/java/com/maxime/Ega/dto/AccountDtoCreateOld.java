package com.maxime.Ega.dto;

import com.maxime.Ega.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDtoCreateOld {

    private AccountType accountType;
    private ClientDtoCreateOld client;
}
