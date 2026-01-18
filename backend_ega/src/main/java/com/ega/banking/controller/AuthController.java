package com.ega.banking.controller;

import com.ega.banking.dto.AuthRequest;
import com.ega.banking.dto.AuthResponse;
import com.ega.banking.dto.ClientLoginRequest;
import com.ega.banking.dto.RegisterRequest;
import com.ega.banking.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "API d'authentification et d'enregistrement")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Se connecter (Admin)")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/client-login")
    @Operation(summary = "Se connecter (Client avec nom + numéro de compte)")
    public ResponseEntity<AuthResponse> clientLogin(@Valid @RequestBody ClientLoginRequest request) {
        return ResponseEntity.ok(authService.clientLogin(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Créer un compte utilisateur")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}
