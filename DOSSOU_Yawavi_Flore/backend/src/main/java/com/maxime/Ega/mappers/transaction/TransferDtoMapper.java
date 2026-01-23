package com.maxime.Ega.mappers.transaction;

import com.maxime.Ega.dto.transaction.TransferDto;
import com.maxime.Ega.entity.Transaction;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring" , uses = {AccountTransferDtoMapper.class})
public interface TransferDtoMapper {
    TransferDto toDto(Transaction transaction);
    Transaction toEntity(TransferDto transferDto);
    List<TransferDto> toDto(List<Transaction> transactions);
}
