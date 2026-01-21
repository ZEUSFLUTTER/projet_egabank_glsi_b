package com.banque.controller;

import com.banque.dto.AuthRequest;
import com.banque.dto.AuthResponse;
import com.banque.dto.ClientAuthRequest;
import com.banque.entity.Client;
import com.banque.entity.User;
import com.banque.repository.ClientRepository;
import com.banque.repository.UserRepository;
import com.banque.security.ClientDetailsService;
import com.banque.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final ClientDetailsService clientDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ CONSTRUCTEUR EXPLICITE AVEC QUALIFIER
    public AuthController(
            AuthenticationManager authenticationManager,
            @Qualifier("customUserDetailsService") UserDetailsService userDetailsService,
            ClientDetailsService clientDetailsService,
            JwtUtil jwtUtil,
            UserRepository userRepository,
            ClientRepository clientRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.clientDetailsService = clientDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setEnabled(true);

        userRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getUsername());

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(
                new AuthResponse(token, "Bearer", user.getUsername(), user.getRole())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(
                new AuthResponse(token, "Bearer", user.getUsername(), user.getRole())
        );
    }

    @PostMapping("/client/login")
    public ResponseEntity<AuthResponse> clientLogin(
            @Valid @RequestBody ClientAuthRequest request
    ) {

        Client client = clientRepository.findByCourriel(request.getCourriel())
                .orElseThrow(() ->
                        new RuntimeException("Client non trouvé avec ce courriel")
                );

        if (client.getPassword() == null ||
            !passwordEncoder.matches(request.getPassword(), client.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        UserDetails userDetails =
                clientDetailsService.loadUserByUsername(client.getCourriel());

        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(
                new AuthResponse(token, "Bearer", client.getCourriel(), "CLIENT")
        );
    }
}
