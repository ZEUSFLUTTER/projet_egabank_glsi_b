package com.ega.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 50) String username,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @Size(max = 50) String role
) {}
