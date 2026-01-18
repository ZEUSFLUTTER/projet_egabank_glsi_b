package com.iai.ega_bank.dto;

public class UserResponse {

    private String username;
    private String email;

    public UserResponse(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // getters
    public String getUsername() { return username; }
    public String getEmail() { return email; }

}
