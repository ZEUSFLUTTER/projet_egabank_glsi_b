package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.AccountDto;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface AccountDtoMapper {
    AccountDto toDto(Account account);
    Account toEntity(AccountDto accountDto);
    List<AccountDto> toDto(List<Account> accounts);
}
