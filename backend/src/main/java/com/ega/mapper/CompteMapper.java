package com.ega.mapper;

import com.ega.dto.CompteDTO;
import com.ega.model.Compte;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CompteMapper {

    @Mapping(source = "client.id", target = "clientId")
    @Mapping(source = "client.nom", target = "clientNom")
    @Mapping(source = "client.prenom", target = "clientPrenom")
    CompteDTO toDTO(Compte compte);

    @Mapping(target = "client", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    Compte toEntity(CompteDTO dto);
}
