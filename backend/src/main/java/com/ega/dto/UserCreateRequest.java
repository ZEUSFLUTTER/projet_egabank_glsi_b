package com.ega.dto;

import com.ega.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserCreateRequest(
        @NotBlank @Email String courriel,
        @NotBlank String motDePasse,
        @NotNull Role role,
        Long clientId
) {}
