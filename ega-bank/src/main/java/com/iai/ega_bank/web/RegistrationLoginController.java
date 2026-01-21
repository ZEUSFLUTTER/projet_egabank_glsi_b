package com.iai.ega_bank.web;

import com.iai.ega_bank.entities.User;
import com.iai.ega_bank.repositories.UserRepository;
import com.iai.ega_bank.dto.UserResponse;
import com.iai.ega_bank.configuration.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/v1")
public class RegistrationLoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public RegistrationLoginController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // Vérifier si username ou email existe déjà
        if (userRepository.findByUsername(user.getUsername()) != null ||
                userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Username or email already exists");
        }

        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);

        // Retourner seulement le username et l'email
        return ResponseEntity.ok(new UserResponse(savedUser.getUsername(), savedUser.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        try {
            // Rechercher l'utilisateur par username ou email
            User existingUser = userRepository.findByUsername(user.getUsername());
            if (existingUser == null) {
                existingUser = userRepository.findByEmail(user.getUsername()); // utiliser le champ username pour l'email
            }

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username or email not found");
            }

            // Authentifier
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            existingUser.getUsername(),
                            user.getPassword()
                    )
            );

            // Générer JWT
            String token = jwtUtils.generateToken(existingUser.getUsername());

            // Préparer la réponse
            Map<String, String> response = new HashMap<>();
            response.put("username", existingUser.getUsername());
            response.put("email", existingUser.getEmail());
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
    }
}
