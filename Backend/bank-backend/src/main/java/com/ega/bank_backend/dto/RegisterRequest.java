package com.ega.bank_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "Username obligatoire") String username,

        @NotBlank(message = "Password obligatoire") String password,

        @NotBlank(message = "Prénom obligatoire") String firstName,

        @NotBlank(message = "Nom obligatoire") String lastName,

        @NotBlank(message = "Email obligatoire") @Email(message = "Email invalide") String email,

        LocalDate birthDate,
        String gender,
        String address,
        String phoneNumber,
        String nationality) {
}
