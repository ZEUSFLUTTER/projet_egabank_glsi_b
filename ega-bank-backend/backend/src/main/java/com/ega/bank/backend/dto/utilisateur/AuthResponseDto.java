package com.ega.bank.backend.dto.utilisateur;

import com.ega.bank.backend.enums.TypeUtilisateur;

public class AuthResponseDto {

    private String token;
    private String email;
    private TypeUtilisateur role;
    private Long clientId;

    // CONSTRUCTEUR PRINCIPAL
    public AuthResponseDto(String token,
            String email,
            TypeUtilisateur role,
            Long clientId) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.clientId = clientId;
    }

    // constructeur sans args
    public AuthResponseDto() {
    }

    // Getters & Setters
    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public TypeUtilisateur getRole() {
        return role;
    }

    public Long getClientId() {
        return clientId;
    }
}