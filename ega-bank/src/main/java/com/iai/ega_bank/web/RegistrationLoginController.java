package com.iai.ega_bank.web;

import com.iai.ega_bank.entities.User;
import com.iai.ega_bank.repositories.UserRepository;
import com.iai.ega_bank.dto.UserResponse;
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

@RestController
@RequestMapping("api/v1")
public class RegistrationLoginController {
    private  final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public RegistrationLoginController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }


//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@RequestBody User user) {
//        if (userRepository.findByUsername(user.getUsername()) != null) {
//            return ResponseEntity.badRequest().body("Username already exist");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return  ResponseEntity.ok(userRepository.save(user));
//    }

//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@RequestBody User user) {
//        // Vérifier si username ou email existe déjà
//        if (userRepository.findByUsername(user.getUsername()) != null ||
//                userRepository.findByEmail(user.getEmail()) != null) {
//            return ResponseEntity.badRequest().body("Username or email already exists");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setRole("ROLE_CLIENT");
//        User savedUser = userRepository.save(user);
//        // Retourner seulement le username et email
//        return ResponseEntity.ok(new UserResponse(savedUser.getUsername(), savedUser.getEmail()));
//    }

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


//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody User user) {
//        try {
//            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
//        return  ResponseEntity.ok("login successly");
//        } catch (AuthenticationException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("username or password invalid");
//        }
//    }

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

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            existingUser.getUsername(), // toujours le username pour Spring Security
                            user.getPassword()
                    )
            );

            return ResponseEntity.ok(new UserResponse(existingUser.getUsername(), existingUser.getEmail()));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
    }


}


