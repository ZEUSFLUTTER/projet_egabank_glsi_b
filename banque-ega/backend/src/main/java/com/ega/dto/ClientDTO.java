package com.ega.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    private String nom;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    private String prenom;
    
    @NotNull(message = "La date de naissance est obligatoire")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
    
    @NotBlank(message = "Le sexe est obligatoire")
    @Pattern(regexp = "M|F", message = "Le sexe doit être M (Masculin) ou F (Féminin)")
    private String sexe;
    
    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200, message = "L'adresse ne peut pas dépasser 200 caractères")
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{8,15}$", message = "Le numéro de téléphone doit contenir entre 8 et 15 chiffres")
    private String telephone;
    
    @NotBlank(message = "Le courriel est obligatoire")
    @Email(message = "Le courriel doit être valide")
    private String courriel;
    
    @NotBlank(message = "La nationalité est obligatoire")
    @Size(min = 2, max = 50, message = "La nationalité doit contenir entre 2 et 50 caractères")
    private String nationalite;
}

