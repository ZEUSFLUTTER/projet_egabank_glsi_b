package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.ClientDto;
import com.maxime.Ega.entity.Client;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface ClientDtoMapper {
    ClientDto toDto(Client client);
    Client toEntity(ClientDto clientDto);
    List<ClientDto> toDto(List<Client> clients);
}
