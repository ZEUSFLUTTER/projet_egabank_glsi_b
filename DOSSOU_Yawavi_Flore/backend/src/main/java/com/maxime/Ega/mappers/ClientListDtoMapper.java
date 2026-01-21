package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.ClientListDto;
import com.maxime.Ega.entity.Client;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "Spring")
public interface ClientListDtoMapper {
    ClientListDto toDto(Client client);
    Client toEntity(ClientListDto clientListDto);
    List<ClientListDto> toDto(List<Client> clients);

}
