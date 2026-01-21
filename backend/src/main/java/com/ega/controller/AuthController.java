package com.ega.controller;

import com.ega.dto.AuthRequestDTO;
import com.ega.dto.AuthResponseDTO;
import com.ega.dto.RefreshTokenRequestDTO;
import com.ega.dto.RegisterRequestDTO;
import com.ega.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        AuthResponseDTO response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO authRequest) {
        AuthResponseDTO response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Renouvelle l'access token si le refresh token est valide
     * Permet de rester connecté même après 3 minutes d'inactivité
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO request) {
        AuthResponseDTO response = authService.refreshAccessToken(request);
        return ResponseEntity.ok(response);
    }
}

