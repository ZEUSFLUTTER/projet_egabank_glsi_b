package com.ega.dto;

import com.ega.model.Role;

public record UserResponse(
        Long id,
        String courriel,
        Role role,
        Boolean enabled,
        Long clientId
) {}
