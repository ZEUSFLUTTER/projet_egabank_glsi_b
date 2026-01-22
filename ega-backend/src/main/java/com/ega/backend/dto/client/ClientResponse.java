package com.ega.backend.dto.client;

import com.ega.backend.domain.enums.Gender;

import java.time.LocalDate;

public record ClientResponse(
        Long id,
        String firstName,
        String lastName,
        LocalDate birthDate,
        Gender gender,
        String address,
        String phone,
        String email,
        String nationality,
        Long accountCount,
        Boolean active
) {}
