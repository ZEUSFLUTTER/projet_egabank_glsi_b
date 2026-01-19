package com.ega.bank_backend.dto;

import com.ega.bank_backend.entity.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record ClientRequestDTO(
        @NotBlank(message = "Le nom est obligatoire") String firstName,
        @NotBlank(message = "Le prénom est obligatoire") String lastName,
        LocalDate birthDate,
        String gender,
        String address,
        String phoneNumber,
        @Email(message = "Email invalide") @NotBlank(message = "L'email est obligatoire") String email,
        String nationality) {
}
