package com.ega.service;

import com.ega.dto.AuthRequestDTO;
import com.ega.dto.AuthResponseDTO;
import com.ega.dto.RegisterRequestDTO;
import com.ega.exception.DuplicateResourceException;
import com.ega.exception.ResourceNotFoundException;
import com.ega.mapper.ClientMapper;
import com.ega.model.Client;
import com.ega.model.Role;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.repository.UserRepository;
import com.ega.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final ClientMapper clientMapper;

    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByCourriel(registerRequest.getCourriel())) {
            throw new DuplicateResourceException("Un utilisateur avec ce courriel existe déjà");
        }

        // Créer le client
        Client client = new Client();
        client.setNom(registerRequest.getNom());
        client.setPrenom(registerRequest.getPrenom());
        client.setDateNaissance(registerRequest.getDateNaissance());
        client.setSexe(registerRequest.getSexe());
        client.setAdresse(registerRequest.getAdresse());
        client.setTelephone(registerRequest.getTelephone());
        client.setCourriel(registerRequest.getCourriel());
        client.setNationalite(registerRequest.getNationalite());

        Client savedClient = clientRepository.save(client);

        // Créer l'utilisateur
        User user = new User();
        user.setCourriel(registerRequest.getCourriel());
        user.setMotDePasse(passwordEncoder.encode(registerRequest.getMotDePasse()));
        user.setRole(Role.ROLE_USER);
        user.setClient(savedClient);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Générer le token JWT
        UserDetails userDetails = savedUser;
        String token = jwtUtil.generateToken(userDetails);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setType("Bearer");
        response.setUserId(savedUser.getId());
        response.setCourriel(savedUser.getCourriel());
        response.setRole(savedUser.getRole());

        return response;
    }

    public AuthResponseDTO login(AuthRequestDTO authRequest) {
        // Authentifier l'utilisateur
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authRequest.getCourriel(),
                authRequest.getMotDePasse()
            )
        );

        // Charger l'utilisateur
        User user = userRepository.findByCourriel(authRequest.getCourriel())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        // Générer le token JWT
        UserDetails userDetails = user;
        String token = jwtUtil.generateToken(userDetails);

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setType("Bearer");
        response.setUserId(user.getId());
        response.setCourriel(user.getCourriel());
        response.setRole(user.getRole());

        return response;
    }
}

