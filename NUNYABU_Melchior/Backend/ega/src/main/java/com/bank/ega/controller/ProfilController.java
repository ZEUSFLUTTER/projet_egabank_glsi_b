package com.bank.ega.controller;

import com.bank.ega.config.JwtUtil;
import com.bank.ega.dto.ApiResponse;
import com.bank.ega.dto.ClientDTO;
import com.bank.ega.service.ProfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
public class ProfilController {

    private final ProfilService profilService;
    private final JwtUtil jwtUtil;

    public ProfilController(ProfilService profilService, JwtUtil jwtUtil) {
        this.profilService = profilService;
        this.jwtUtil = jwtUtil;
    }

    // Obtenir son profil
    @GetMapping
    public ResponseEntity<ApiResponse<ClientDTO>> getProfil(
            @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            ClientDTO profil = profilService.getProfilByUsername(username);
            return ResponseEntity.ok(ApiResponse.success("Profil récupéré avec succès", profil));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Token invalide ou expiré"));
        }
    }

    // Mettre à jour son profil
    @PutMapping
    public ResponseEntity<ApiResponse<ClientDTO>> updateProfil(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody ClientDTO clientDTO) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            ClientDTO updated = profilService.updateProfil(username, clientDTO);
            return ResponseEntity.ok(ApiResponse.success("Profil mis à jour avec succès", updated));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Erreur: " + e.getMessage()));
        }
    }
}
