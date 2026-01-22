package com.maxime.Ega.mappers.user;

import com.maxime.Ega.dto.user.ListUserDto;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ListUserDtoMapper {

    ListUserDto toDto(User user);

    List<ListUserDto> toDto(List<Account> accountList);
}
