package com.ega.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record UpdateRoleRequest(
        @NotBlank String role
) {}

