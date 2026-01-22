package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.TransactionDepWithDto;
import com.maxime.Ega.entity.Transaction;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring", uses = {AccountDepWithDtoMapper.class})
public interface TransactionDepWithDtoMapper {
    TransactionDepWithDto toDto(Transaction transaction);
    Transaction toEntity(TransactionDepWithDto transactionDepWithDto);
    List<TransactionDepWithDto> toDto(List<Transaction> transactions);
}
