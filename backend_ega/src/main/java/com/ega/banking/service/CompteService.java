package com.ega.banking.service;

import com.ega.banking.dto.CompteDTO;
import com.ega.banking.exception.InvalidOperationException;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.*;
import com.ega.banking.repository.ClientRepository;
import com.ega.banking.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final Random random = new Random();

    public CompteDTO creerCompteEpargne(Long clientId, BigDecimal tauxInteret) {
        log.info("Création d'un compte épargne pour le client: ID={}", clientId);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));

        CompteEpargne compte = CompteEpargne.builder()
                .tauxInteret(tauxInteret != null ? tauxInteret : new BigDecimal("2.5"))
                .build();

        compte.setNumeroCompte(genererIBAN());
        compte.setSolde(BigDecimal.ZERO);
        compte.setClient(client);
        compte.setType(TypeCompte.EPARGNE);

        CompteEpargne savedCompte = (CompteEpargne) compteRepository.save(compte);
        log.info("Compte épargne créé: IBAN={}", savedCompte.getNumeroCompte());

        return mapToDTO(savedCompte);
    }

    public CompteDTO creerCompteCourant(Long clientId, BigDecimal decouvertAutorise) {
        log.info("Création d'un compte courant pour le client: ID={}", clientId);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));

        CompteCourant compte = CompteCourant.builder()
                .decouvertAutorise(decouvertAutorise != null ? decouvertAutorise : BigDecimal.ZERO)
                .build();

        compte.setNumeroCompte(genererIBAN());
        compte.setSolde(BigDecimal.ZERO);
        compte.setClient(client);
        compte.setType(TypeCompte.COURANT);

        CompteCourant savedCompte = (CompteCourant) compteRepository.save(compte);
        log.info("Compte courant créé: IBAN={}", savedCompte.getNumeroCompte());

        return mapToDTO(savedCompte);
    }

    @Transactional(readOnly = true)
    public List<CompteDTO> obtenirTousLesComptes() {
        log.info("Récupération de tous les comptes");
        return compteRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompteDTO obtenirCompteParId(Long id) {
        log.info("Récupération du compte: ID={}", id);
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", id));
        return mapToDTO(compte);
    }

    @Transactional(readOnly = true)
    public CompteDTO obtenirCompteParNumero(String numeroCompte) {
        log.info("Récupération du compte par numéro: {}", numeroCompte);
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "numéro", numeroCompte));
        return mapToDTO(compte);
    }

    @Transactional(readOnly = true)
    public List<CompteDTO> obtenirComptesParClient(Long clientId) {
        log.info("Récupération des comptes du client: ID={}", clientId);

        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client", "id", clientId);
        }

        return compteRepository.findByClientId(clientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompteDTO> obtenirComptesDuClientConnecte() {
        org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
        String username = authentication.getName();
        log.info("Récupération des comptes du client connecté: username={}", username);

        Client client;

        if (username.startsWith("CLIENT_ID:")) {
            Long clientId = Long.parseLong(username.substring(10));
            client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));
        } else {
            // Pour les anciens clients avec User associé
            client = clientRepository.findByUserUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Client", "username", username));
        }

        log.info("✅ Client trouvé: ID={}, Nom={} {}", client.getId(), client.getPrenom(), client.getNom());

        List<CompteDTO> comptes = compteRepository.findByClientId(client.getId()).stream()
                .map(this::mapToDTO)
                .collect(java.util.stream.Collectors.toList());

        log.info("✅ {} compte(s) trouvé(s) pour le client ID={}", comptes.size(), client.getId());

        return comptes;
    }

    public void supprimerCompte(Long id) {
        log.info("Suppression du compte: ID={}", id);

        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", id));

        // Vérifier que le solde est à zéro
        if (compte.getSolde().compareTo(BigDecimal.ZERO) != 0) {
            throw new InvalidOperationException("Impossible de supprimer un compte avec un solde non nul");
        }

        compteRepository.deleteById(id);
        log.info("Compte supprimé avec succès: ID={}", id);
    }

    // Génération d'IBAN avec iban4j
    private String genererIBAN() {
        // Générer un IBAN pour le pays FR (France) avec un code banque et compte
        // aléatoires
        Iban iban = new Iban.Builder()
                .countryCode(CountryCode.FR)
                .bankCode(String.format("%05d", random.nextInt(100000)))
                .branchCode(String.format("%05d", random.nextInt(100000)))
                .accountNumber(String.format("%011d", random.nextLong(100000000000L)))
                .buildRandom();

        return iban.toString();
    }

    // Méthodes de mapping
    private CompteDTO mapToDTO(Compte compte) {
        CompteDTO dto = CompteDTO.builder()
                .id(compte.getId())
                .numeroCompte(compte.getNumeroCompte())
                .type(compte.getType())
                .clientId(compte.getClient().getId())
                .clientNom(compte.getClient().getNom())
                .clientPrenom(compte.getClient().getPrenom())
                .solde(compte.getSolde())
                .dateCreation(compte.getDateCreation())
                .build();

        // Ajouter les champs spécifiques selon le type
        if (compte instanceof CompteEpargne) {
            dto.setTauxInteret(((CompteEpargne) compte).getTauxInteret());
        } else if (compte instanceof CompteCourant) {
            dto.setDecouvertAutorise(((CompteCourant) compte).getDecouvertAutorise());
        }

        return dto;
    }
}
