package com.maxime.Ega.mappers;

import com.maxime.Ega.dto.ClientUpdateDto;
import com.maxime.Ega.entity.Client;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "Spring")
public interface ClientUpdateDtoMapper {
    ClientUpdateDto toDto(Client client);
    Client toEntity(ClientUpdateDto clientUpdateDto);
    List<ClientUpdateDto> toDto(List<Client> clients);
}
