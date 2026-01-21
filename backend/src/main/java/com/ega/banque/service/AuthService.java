package com.ega.banque.service;

import com.ega.banque.dto.RegisterRequest;
import com.ega.banque.entity.Client;
import com.ega.banque.repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
public class AuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(ClientRepository clientRepository, PasswordEncoder passwordEncoder) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Client register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (clientRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Un client avec cet email existe déjà");
        }

        // Vérifier si le username existe déjà
        if (clientRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Ce nom d'utilisateur est déjà pris");
        }

        Client client = new Client();
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setEmail(request.getEmail());
        client.setUsername(request.getUsername());
        client.setPassword(passwordEncoder.encode(request.getPassword()));
        client.setTelephone(request.getTelephone());
        client.setAdresse(request.getAdresse());
        client.setSexe(request.getSexe());
        client.setNationalite(request.getNationalite());
        client.setRole("CLIENT");

        if (request.getDateNaissance() != null && !request.getDateNaissance().isEmpty()) {
            try {
                client.setDateNaissance(LocalDate.parse(request.getDateNaissance(), DateTimeFormatter.ISO_LOCAL_DATE));
            } catch (Exception e) {
                // Si le format n'est pas correct, on laisse null
            }
        }

        return clientRepository.save(client);
    }

    public Client authenticate(String usernameOrEmail, String password) {
        Client client = clientRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new RuntimeException("Identifiants invalides"));

        if (!passwordEncoder.matches(password, client.getPassword())) {
            throw new RuntimeException("Identifiants invalides");
        }

        return client;
    }
}
