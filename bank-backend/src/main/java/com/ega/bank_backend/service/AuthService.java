package com.ega.bank_backend.service;

import com.ega.bank_backend.dto.LoginRequest;
import com.ega.bank_backend.dto.LoginResponse;
import com.ega.bank_backend.dto.RegisterRequest;
import com.ega.bank_backend.entity.AppUser;
import com.ega.bank_backend.entity.Client;
import com.ega.bank_backend.entity.Role;
import com.ega.bank_backend.repository.ClientRepository;
import com.ega.bank_backend.repository.UserRepository;
import com.ega.bank_backend.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, ClientRepository clientRepository,
            PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username déjà utilisé");
        }

        AppUser user = new AppUser();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.CLIENT);

        Client client = new Client();
        client.setFirstName(request.firstName());
        client.setLastName(request.lastName());
        client.setEmail(request.email());
        client.setBirthDate(request.birthDate());
        client.setGender(request.gender());
        client.setAddress(request.address());
        client.setPhoneNumber(request.phoneNumber());
        client.setNationality(request.nationality());

        client.setUser(user);
        user.setClient(client);

        userRepository.save(user); // Also saves client due to CascadeType.ALL in Client
        // Note: For User -> Client, we might need saving user first or client depending
        // on ownership.
        // In my entity definition, Client has @JoinColumn(name = "user_id"). So Client
        // owns the relationship.
        clientRepository.save(client);

        return "Inscription réussie";
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtUtils.generateToken(userDetails);
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return new LoginResponse(token, userDetails.getUsername(), role);
    }
}
