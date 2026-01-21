package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.AccountDepWithDto;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface AccountDepWithDtoMapper {
    AccountDepWithDto toDto(Account account);
    Account toEntity(AccountDepWithDto accountDepWithDto);
    List<AccountDepWithDto> toDto(List<Account> accounts);
}
