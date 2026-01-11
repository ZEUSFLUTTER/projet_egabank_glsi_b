package com.ega.bank_backend.dto;

import java.util.List;

public record ClientResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        List<AccountResponseDTO> accounts) {
}
