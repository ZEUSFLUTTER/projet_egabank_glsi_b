package com.ega.mapper;

import com.ega.dto.TransactionDTO;
import com.ega.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
    
    @Mapping(target = "compteId", source = "compte.id")
    @Mapping(target = "compteNumero", source = "compte.numeroCompte")
    @Mapping(target = "compteDestinationId", source = "compteDestination.id")
    @Mapping(target = "compteDestinationNumero", source = "compteDestination.numeroCompte")
    TransactionDTO toDTO(Transaction transaction);
    
    @Mapping(target = "compte", ignore = true)
    @Mapping(target = "compteDestination", ignore = true)
    Transaction toEntity(TransactionDTO transactionDTO);
}

