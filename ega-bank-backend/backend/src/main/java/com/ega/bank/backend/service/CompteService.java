package com.ega.bank.backend.service;

import com.ega.bank.backend.entity.Client;
import com.ega.bank.backend.entity.Compte;
import com.ega.bank.backend.entity.Utilisateur;
import com.ega.bank.backend.enums.TypeCompte;
import com.ega.bank.backend.enums.TypeUtilisateur;
import com.ega.bank.backend.exception.BusinessException;
import com.ega.bank.backend.repository.ClientRepository;
import com.ega.bank.backend.repository.CompteRepository;
import com.ega.bank.backend.repository.UtilisateurRepository;
import org.iban4j.Iban;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CompteService(
            CompteRepository compteRepository,
            ClientRepository clientRepository,
            UtilisateurRepository utilisateurRepository) {
        this.compteRepository = compteRepository;
        this.clientRepository = clientRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // CREATE COMPTE (ADMIN / AGENT)
    public Compte creerCompte(Long clientId, TypeCompte typeCompte) {

        Utilisateur utilisateur = getUtilisateurConnecte();
        if (utilisateur.getRole() == TypeUtilisateur.CLIENT) {
            throw new BusinessException("Un client ne peut pas créer de compte");
        }

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BusinessException("Client introuvable"));

        Compte compte = new Compte();
        compte.setClient(client);
        compte.setTypeCompte(typeCompte);
        compte.setDateCreation(LocalDate.now());
        compte.setSolde(BigDecimal.ZERO);
        compte.setNumeroCompte(genererNumeroCompte());

        return compteRepository.save(compte);
    }

    // CLIENT et SES COMPTES
    public List<Compte> getComptesDuClientConnecte() {

        Utilisateur utilisateur = getUtilisateurConnecte();

        if (utilisateur.getRole() != TypeUtilisateur.CLIENT) {
            throw new BusinessException("Seul un client peut accéder à ses comptes");
        }

        Client client = utilisateur.getClient();
        if (client == null) {
            throw new BusinessException("Aucun client associé à cet utilisateur");
        }

        return compteRepository.findByClient(client);
    }

    // ADMIN / AGENT / COMPTES CLIENT
    public List<Compte> getComptesByClient(Long clientId) {

        Utilisateur utilisateur = getUtilisateurConnecte();

        if (utilisateur.getRole() == TypeUtilisateur.CLIENT) {
            throw new BusinessException("Accès interdit");
        }

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BusinessException("Client introuvable"));

        return compteRepository.findByClient(client);
    }

    // OUTILS
    private Utilisateur getUtilisateurConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BusinessException("Utilisateur non authentifié"));
    }

    private String genererNumeroCompte() {
        return Iban.random().toString();
    }
}