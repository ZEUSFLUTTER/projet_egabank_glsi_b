package com.ega.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {

    private Long id;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotNull
    @Past
    private LocalDate dateNaissance;

    @NotBlank
    @Pattern(regexp = "M|F")
    private String sexe;

    @NotBlank
    private String adresse;

    @NotBlank
    @Pattern(regexp = "^[0-9]{8,15}$")
    private String telephone;

    @Email
    @NotBlank
    private String courriel;

    @NotBlank
    private String nationalite;

    private boolean actif;
}
