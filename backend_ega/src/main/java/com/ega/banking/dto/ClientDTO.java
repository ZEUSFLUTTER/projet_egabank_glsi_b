package com.ega.banking.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {

    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50)
    private String prenom;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;

    @NotBlank(message = "Le sexe est obligatoire")
    @Pattern(regexp = "^(M|F)$", message = "Le sexe doit être M ou F")
    private String sexe;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200)
    private String adresse;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9]{8,15}$")
    private String telephone;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 50)
    private String nationalite;

    private Integer nombreComptes;

    // Identifiants de connexion (uniquement remplis lors de la création)
    private String username;
    private String temporaryPassword;
}
