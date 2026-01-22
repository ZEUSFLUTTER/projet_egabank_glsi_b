package com.maxime.Ega.mappers.user;

import com.maxime.Ega.dto.user.CreateUserDto;
import com.maxime.Ega.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CreateUserDtoMapper {
    User toEntity(CreateUserDto userDto);

}
