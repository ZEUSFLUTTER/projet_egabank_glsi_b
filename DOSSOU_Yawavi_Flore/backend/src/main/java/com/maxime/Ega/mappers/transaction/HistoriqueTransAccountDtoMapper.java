package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.HistoriqueTransAccountDto;
import com.maxime.Ega.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface HistoriqueTransAccountDtoMapper {
    @Mapping(source = "accountNumber", target = "accountNumber")
    HistoriqueTransAccountDto toDto(Account account);
}

