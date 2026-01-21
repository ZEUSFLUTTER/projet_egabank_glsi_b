package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.AccountDtoCreateOld;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface AccountDtoCreateOldMapper {
    AccountDtoCreateOld toDto(Account account);
    Account toEntity(AccountDtoCreateOld accountDtoCreateOld);
    List<AccountDtoCreateOld> toDto(List<Account> accountList);
}
