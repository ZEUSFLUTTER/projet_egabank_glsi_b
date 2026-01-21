package com.maxime.Ega.dto.user;

import com.maxime.Ega.entity.Role;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ListUserDto {

    private String matricule;

    private String firstName;

    private String lastName;

    private String username;

    private String email;

    private String phoneNumber;

    private boolean isActive;
}
