package com.ega.banking.service;

import com.ega.banking.dto.AuthRequest;
import com.ega.banking.dto.AuthResponse;
import com.ega.banking.dto.RegisterRequest;
import com.ega.banking.exception.DuplicateResourceException;
import com.ega.banking.model.User;
import com.ega.banking.repository.UserRepository;
import com.ega.banking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(AuthRequest request) {
        log.info("Tentative de connexion pour l'utilisateur: {}", request.getUsername());

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

        log.info("Utilisateur enregistré avec succès: {}", request.getUsername());

        // Authentifier automatiquement après l'enregistrement
        AuthRequest authRequest = new AuthRequest(request.getUsername(), request.getPassword());
        return login(authRequest);
    }
}
