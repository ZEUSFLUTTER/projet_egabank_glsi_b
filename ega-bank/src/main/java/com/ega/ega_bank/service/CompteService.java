package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.CompteDTO;
import com.ega.ega_bank.dto.CreateCompteRequest;
import com.ega.ega_bank.exception.ResourceNotFoundException;
import com.ega.ega_bank.model.*;
import com.ega.ega_bank.repository.ClientRepository;
import com.ega.ega_bank.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;

    public CompteDTO createCompte(CreateCompteRequest request) {
        Client client = clientRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + request.getClientId()));

        Compte compte;
        if (request.getType() == TypeCompte.COURANT) {
            CompteCourant compteCourant = new CompteCourant();
            compteCourant.setType(TypeCompte.COURANT);
            compteCourant.setClient(client);
            compteCourant.setDecouvertAutorise(
                    request.getDecouvertAutorise() != null ? request.getDecouvertAutorise() : BigDecimal.ZERO
            );
            compte = compteCourant;
        } else {
            CompteEpargne compteEpargne = new CompteEpargne();
            compteEpargne.setType(TypeCompte.EPARGNE);
            compteEpargne.setClient(client);
            compteEpargne.setTauxInteret(
                    request.getTauxInteret() != null ? request.getTauxInteret() : BigDecimal.valueOf(2.5)
            );
            compte = compteEpargne;
        }

        Compte savedCompte = compteRepository.save(compte);
        return mapToDTO(savedCompte);
    }

    @Transactional(readOnly = true)
    public CompteDTO getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        return mapToDTO(compte);
    }

    @Transactional(readOnly = true)
    public CompteDTO getCompteByNumero(String numeroCompte) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec le numéro: " + numeroCompte));
        return mapToDTO(compte);
    }

    @Transactional(readOnly = true)
    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompteDTO> getComptesByClientId(Long clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + clientId);
        }
        return compteRepository.findByClientId(clientId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteCompte(Long id) {
        if (!compteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id);
        }
        compteRepository.deleteById(id);
    }

    // Méthodes de mapping
    private CompteDTO mapToDTO(Compte compte) {
        CompteDTO dto = CompteDTO.builder()
                .id(compte.getId())
                .numeroCompte(compte.getNumeroCompte())
                .type(compte.getType())
                .dateCreation(compte.getDateCreation())
                .solde(compte.getSolde())
                .clientId(compte.getClient().getId())
                .clientNom(compte.getClient().getNom())
                .clientPrenom(compte.getClient().getPrenom())
                .build();

        if (compte instanceof CompteCourant) {
            dto.setDecouvertAutorise(((CompteCourant) compte).getDecouvertAutorise());
        } else if (compte instanceof CompteEpargne) {
            dto.setTauxInteret(((CompteEpargne) compte).getTauxInteret());
        }

        return dto;
    }
}
