package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.HistoriqueTransactionDto;
import com.maxime.Ega.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {HistoriqueTransAccountDtoMapper.class})
public interface HistoriqueTransactionDtoMapper {

    @Mapping(source = "account", target = "accountNumber")
    HistoriqueTransactionDto toDto(Transaction transaction);

    List<HistoriqueTransactionDto> toDto(List<Transaction> transactions);
}


