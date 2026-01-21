package com.ega.dto;

import com.ega.model.Role;

public record UserUpdateRequest(
        String motDePasse,
        Role role,
        Boolean enabled
) {}
