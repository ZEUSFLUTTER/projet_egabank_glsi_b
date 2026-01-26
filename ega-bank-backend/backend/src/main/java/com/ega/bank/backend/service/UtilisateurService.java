package com.ega.bank.backend.service;

import com.ega.bank.backend.dto.utilisateur.RegisterRequestDto;
import com.ega.bank.backend.entity.Client;
import com.ega.bank.backend.entity.Utilisateur;
import com.ega.bank.backend.enums.TypeUtilisateur;
import com.ega.bank.backend.exception.BusinessException;
import com.ega.bank.backend.exception.ResourceNotFoundException;
import com.ega.bank.backend.repository.ClientRepository;
import com.ega.bank.backend.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
            ClientRepository clientRepository,
            PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Méthode utilisée par AuthController (/auth/register)
    public Utilisateur inscrireUtilisateur(RegisterRequestDto dto) {

        TypeUtilisateur role = dto.getRole();
        Long clientId = dto.getClientId();

        return creerUtilisateur(
                dto.getEmail(),
                dto.getMotDePasse(),
                role,
                clientId);
    }

    // Logique métier centrale
    public Utilisateur creerUtilisateur(String email,
            String motDePasse,
            TypeUtilisateur role,
            Long clientId) {

        if (utilisateurRepository.existsByEmail(email)) {
            throw new BusinessException("Un utilisateur avec cet email existe déjà");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(email);
        utilisateur.setMotDePasse(passwordEncoder.encode(motDePasse));
        utilisateur.setRole(role);
        utilisateur.setActif(true);

        if (role == TypeUtilisateur.CLIENT) {
            if (clientId == null) {
                throw new BusinessException("Un utilisateur CLIENT doit être lié à un client");
            }

            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

            utilisateur.setClient(client);
        }

        return utilisateurRepository.save(utilisateur);
    }

    // Utilisé par AuthController + Security
    public Utilisateur chargerParEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }
}