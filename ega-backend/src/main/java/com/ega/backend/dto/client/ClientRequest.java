package com.ega.backend.dto.client;

import com.ega.backend.domain.enums.Gender;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record ClientRequest(
        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,
        @NotNull LocalDate birthDate,
        @NotNull Gender gender,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 20) String phone,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 100) String nationality
) {}
