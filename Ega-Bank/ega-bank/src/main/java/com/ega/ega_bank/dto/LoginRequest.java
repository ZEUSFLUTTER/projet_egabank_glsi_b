package com.ega.ega_bank.dto;

public class LoginRequest {
    private String courriel;
    private String password;

    public LoginRequest() {}

    public LoginRequest(String courriel, String password) {
        this.courriel = courriel;
        this.password = password;
    }

    // Getters et Setters
    public String getCourriel() { return courriel; }
    public void setCourriel(String courriel) { this.courriel = courriel; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}