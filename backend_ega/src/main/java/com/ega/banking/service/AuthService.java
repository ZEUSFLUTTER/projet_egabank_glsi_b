package com.ega.banking.service;

import com.ega.banking.dto.AuthRequest;
import com.ega.banking.dto.AuthResponse;
import com.ega.banking.dto.ClientLoginRequest;
import com.ega.banking.dto.RegisterRequest;
import com.ega.banking.exception.DuplicateResourceException;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.Compte;
import com.ega.banking.model.User;
import com.ega.banking.repository.CompteRepository;
import com.ega.banking.repository.UserRepository;
import com.ega.banking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

        private final UserRepository userRepository;
        private final com.ega.banking.repository.ClientRepository clientRepository;
        private final CompteRepository compteRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider tokenProvider;

        public AuthResponse login(AuthRequest request) {
                log.info("Tentative de connexion pour l'utilisateur: {}, longueur password: {}",
                                request.getUsername(),
                                request.getPassword() != null ? request.getPassword().length() : "null");

                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String token = tokenProvider.generateToken(authentication);

                User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

                log.info("Connexion réussie pour l'utilisateur: {}", request.getUsername());

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .username(user.getUsername())
                                .email(user.getEmail())
                                .role(user.getRole())
                                .build();
        }

        public AuthResponse clientLogin(ClientLoginRequest request) {
                log.info("Tentative de connexion client avec nom: {} et compte: {}",
                                request.getNom(), request.getNumeroCompte());

                // Chercher le compte par numéro
                Compte compte = compteRepository.findByNumeroCompte(request.getNumeroCompte())
                                .orElseThrow(() -> new ResourceNotFoundException("Compte", "numéro",
                                                request.getNumeroCompte()));

                // Vérifier que le nom correspond au client propriétaire du compte
                com.ega.banking.model.Client client = compte.getClient();
                if (client == null || !client.getNom().trim().equalsIgnoreCase(request.getNom().trim())) {
                        log.warn("Nom incorrect pour le compte: {}. Attendu: {}, Reçu: {}",
                                        request.getNumeroCompte(), client != null ? client.getNom() : "null",
                                        request.getNom());
                        throw new ResourceNotFoundException("Client", "nom", request.getNom());
                }

                log.info("Client authentifié: {} {} (ID: {})", client.getPrenom(), client.getNom(), client.getId());

                // Créer une authentification manuelle pour le client
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                                "CLIENT_ID:" + client.getId(), // Utiliser l'ID du client avec préfixe
                                null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                String token = tokenProvider.generateToken(authentication);

                return AuthResponse.builder()
                                .token(token)
                                .type("Bearer")
                                .username(client.getPrenom() + " " + client.getNom())
                                .email(client.getEmail())
                                .role("ROLE_USER")
                                .build();
        }

        public AuthResponse register(RegisterRequest request) {
                log.info("Enregistrement d'un nouvel utilisateur: {}", request.getUsername());

                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new DuplicateResourceException("Utilisateur", "nom d'utilisateur", request.getUsername());
                }

                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new DuplicateResourceException("Utilisateur", "email", request.getEmail());
                }

                User user = User.builder()
                                .username(request.getUsername())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role("ROLE_USER")
                                .enabled(true)
                                .build();

                userRepository.save(user);

                // Créer le client associé
                com.ega.banking.model.Client client = com.ega.banking.model.Client.builder()
                                .nom(request.getNom())
                                .prenom(request.getPrenom())
                                .dateNaissance(request.getDateNaissance())
                                .sexe(request.getSexe())
                                .adresse(request.getAdresse())
                                .telephone(request.getTelephone())
                                .email(request.getEmail())
                                .nationalite(request.getNationalite())
                                .user(user)
                                .build();

                clientRepository.save(client);

                log.info("Utilisateur enregistré avec succès: {}", request.getUsername());

                // Authentifier automatiquement après l'enregistrement
                AuthRequest authRequest = new AuthRequest(request.getUsername(), request.getPassword());
                return login(authRequest);
        }
}
