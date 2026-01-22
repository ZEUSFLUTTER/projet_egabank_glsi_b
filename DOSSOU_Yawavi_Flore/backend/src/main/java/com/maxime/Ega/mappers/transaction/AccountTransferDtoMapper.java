package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.AccountTransferDto;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface AccountTransferDtoMapper {
    AccountTransferDto toDto(Account account);
    Account  toEntity(AccountTransferDto accountTransferDto);
    List<AccountTransferDto> toDto(List<Account> accounts);
}
