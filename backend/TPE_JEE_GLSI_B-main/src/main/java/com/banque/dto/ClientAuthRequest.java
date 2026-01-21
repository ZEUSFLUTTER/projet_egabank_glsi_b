package com.banque.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientAuthRequest {
    
    @NotBlank(message = "Le courriel est requis")
    @Email(message = "Le courriel doit être valide")
    private String courriel;
    
    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}
