package com.iai.projet.banque.models;

public class AuthResponse {
    private String token;
    private String roles;

    public AuthResponse(String token) {
        this.token = token;
    }

    public AuthResponse() {

    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }
}
