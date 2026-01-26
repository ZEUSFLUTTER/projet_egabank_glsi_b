package com.ega.bank.backend.controller;

import com.ega.bank.backend.dto.utilisateur.AuthRequestDto;
import com.ega.bank.backend.dto.utilisateur.AuthResponseDto;
import com.ega.bank.backend.dto.utilisateur.RegisterRequestDto;
import com.ega.bank.backend.entity.Utilisateur;
import com.ega.bank.backend.security.JwtUtils;
import com.ega.bank.backend.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

        private final UtilisateurService utilisateurService;
        private final AuthenticationManager authenticationManager;
        private final JwtUtils jwtUtils;

        public AuthController(UtilisateurService utilisateurService,
                        AuthenticationManager authenticationManager,
                        JwtUtils jwtUtils) {
                this.utilisateurService = utilisateurService;
                this.authenticationManager = authenticationManager;
                this.jwtUtils = jwtUtils;
        }

        // REGISTER
        @PostMapping("/register")
        public ResponseEntity<AuthResponseDto> register(
                        @Valid @RequestBody RegisterRequestDto dto) {

                Utilisateur utilisateur = utilisateurService.inscrireUtilisateur(dto);

                String token = jwtUtils.generateToken(utilisateur.getEmail());

                AuthResponseDto response = new AuthResponseDto(
                                token,
                                utilisateur.getEmail(),
                                utilisateur.getRole(),
                                utilisateur.getClient() != null
                                                ? utilisateur.getClient().getId()
                                                : null);

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(response);
        }

        // LOGIN
        @PostMapping("/login")
        public ResponseEntity<AuthResponseDto> login(
                        @Valid @RequestBody AuthRequestDto dto) {

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                dto.getEmail(),
                                                dto.getMotDePasse()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                Utilisateur utilisateur = utilisateurService
                                .chargerParEmail(dto.getEmail());

                String token = jwtUtils.generateToken(utilisateur.getEmail());

                AuthResponseDto response = new AuthResponseDto(
                                token,
                                utilisateur.getEmail(),
                                utilisateur.getRole(),
                                utilisateur.getClient() != null
                                                ? utilisateur.getClient().getId()
                                                : null);

                return ResponseEntity.ok(response);
        }
}
