package com.ega.mapper;

import com.ega.dto.ClientDTO;
import com.ega.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ClientMapper {
    ClientMapper INSTANCE = Mappers.getMapper(ClientMapper.class);
    
    ClientDTO toDTO(Client client);
    
    Client toEntity(ClientDTO clientDTO);
}

