package com.example.egabank.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password; // Changé de motDePasse à password pour correspondre au frontend
}