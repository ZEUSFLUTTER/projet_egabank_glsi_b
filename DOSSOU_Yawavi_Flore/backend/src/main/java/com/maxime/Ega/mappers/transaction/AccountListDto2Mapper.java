package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.AccountListDto;
import com.maxime.Ega.dto.transaction.AccountListDto2;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.mappers.ClientListDtoMapper;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring", uses = ClientListDtoMapper.class)
public interface AccountListDto2Mapper {
    AccountListDto2 toDto(Account account);
    List<AccountListDto2> toDto(List<Account> accountList);
}
