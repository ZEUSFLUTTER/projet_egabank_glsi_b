package com.ega.bank_backend.dto;

public record LoginResponse(String token, String username, String role) {
}
