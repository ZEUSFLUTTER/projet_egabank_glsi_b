package com.ega.dto;

import com.ega.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String accessToken;      // Token court (3 min) - utilisé pour les requêtes
    private String refreshToken;     // Token long (7 jours) - pour renouveler la session
    private String type = "Bearer";
    private Long userId;
    private String courriel;
    private Role role;
    private Long expiresIn = 180000L; // 3 minutes en millisecondes
}

