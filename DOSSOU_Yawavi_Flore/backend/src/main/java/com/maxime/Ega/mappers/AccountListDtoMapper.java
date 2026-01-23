package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.AccountListDto;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring", uses = ClientListDtoMapper.class)
public interface AccountListDtoMapper {
    AccountListDto toDto(Account account);
    Account  toEntity(AccountListDto accountListDto);
    List<AccountListDto> toDto(List<Account> accountList);
}
