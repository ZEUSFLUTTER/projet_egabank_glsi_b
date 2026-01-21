package com.banque.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    
    @NotBlank(message = "Le nom est requis")
    private String nom;
    
    @NotBlank(message = "Le prénom est requis")
    private String prenom;
    
    @NotNull(message = "La date de naissance est requise")
    @Past(message = "La date de naissance doit être dans le passé")
    private LocalDate dateNaissance;
    
    @NotBlank(message = "Le sexe est requis")
    private String sexe;
    
    @NotBlank(message = "Le courriel est requis")
    @Email(message = "Le courriel doit être valide")
    private String courriel;
    
    @NotBlank(message = "L'adresse est requise")
    private String adresse;
    
    @NotBlank(message = "Le numéro de téléphone est requis")
    private String numTelephone;
    
    @NotBlank(message = "La nationalité est requise")
    private String nationalite;
    
    // Champ optionnel pour le mot de passe (uniquement lors de la création)
    private String password;
}
