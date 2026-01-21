package com.ega.mapper;

import com.ega.dto.CompteDTO;
import com.ega.model.Compte;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CompteMapper {
    CompteMapper INSTANCE = Mappers.getMapper(CompteMapper.class);
    
    @Mapping(target = "clientId", source = "client.id")
    @Mapping(target = "clientNom", source = "client.nom")
    @Mapping(target = "clientPrenom", source = "client.prenom")
    CompteDTO toDTO(Compte compte);
    
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    Compte toEntity(CompteDTO compteDTO);
}

