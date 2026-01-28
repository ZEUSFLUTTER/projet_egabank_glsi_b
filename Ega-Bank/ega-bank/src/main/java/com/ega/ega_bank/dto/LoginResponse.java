package com.ega.ega_bank.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String token, String role) {
        this.token = token;
        this.role = role;
        this.message = "Connexion réussie";
    }

    public LoginResponse(String message) {
        this.message = message;
    }

    // Getters et Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}