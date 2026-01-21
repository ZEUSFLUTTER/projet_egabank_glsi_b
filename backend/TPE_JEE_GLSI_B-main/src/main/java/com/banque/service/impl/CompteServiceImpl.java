package com.banque.service.impl;

import com.banque.dto.CompteDTO;
import com.banque.entity.Client;
import com.banque.entity.Compte;
import com.banque.repository.ClientRepository;
import com.banque.repository.CompteRepository;
import com.banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CompteServiceImpl implements CompteService {
    
    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    
    private static final Random random = new Random();
    private static final String BANK_CODE = "12345"; // Code banque fictif
    
    // Méthode privée pour générer un numéro de compte unique
    private String generateNumCompte() {
        String num;
        do {
            num = "TG" + System.currentTimeMillis() + random.nextInt(1000);
        } while (compteRepository.findByNumCompte(num).isPresent());
        return num;
    }
    
    // Méthode privée pour convertir Entity vers DTO
    private CompteDTO toDTO(Compte compte) {
        if (compte == null) {
            return null;
        }
        return new CompteDTO(
            compte.getId(),
            compte.getNumCompte(),
            compte.getTypeCompte(),
            compte.getDateCreation(),
            compte.getSolde(),
            compte.getClient() != null ? compte.getClient().getId() : null
        );
    }
    
    @Override
    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CompteDTO getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        return toDTO(compte);
    }
    
    @Override
    public List<CompteDTO> getComptesByClient(Long clientId) {
        return compteRepository.findByClientId(clientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public CompteDTO createCompte(CompteDTO compteDTO) {
        // Vérifier si le client existe
        Client client = clientRepository.findById(compteDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + compteDTO.getClientId()));
        
        // Vérifier si le client a déjà un compte de ce type
        if (compteRepository.existsByClientIdAndTypeCompte(compteDTO.getClientId(), compteDTO.getTypeCompte())) {
            throw new RuntimeException("Ce client a déjà un compte de type " + compteDTO.getTypeCompte());
        }
        
        // Générer automatiquement un IBAN si non fourni
        String numCompte;
        if (compteDTO.getNumCompte() == null || compteDTO.getNumCompte().trim().isEmpty()) {
            numCompte = generateNumCompte();
        } else {
            // Vérifier si le numéro de compte fourni existe déjà
            if (compteRepository.findByNumCompte(compteDTO.getNumCompte()).isPresent()) {
                throw new RuntimeException("Un compte avec ce numéro existe déjà");
            }
            // Valider le format IBAN si fourni
            try {
                Iban.valueOf(compteDTO.getNumCompte());
                numCompte = compteDTO.getNumCompte();
            } catch (Exception e) {
                throw new RuntimeException("Le numéro de compte fourni n'est pas un IBAN valide");
            }
        }
        
        Compte compte = new Compte();
        compte.setNumCompte(numCompte);
        compte.setTypeCompte(compteDTO.getTypeCompte());
        compte.setDateCreation(LocalDate.now());
        compte.setSolde(compteDTO.getSolde() != null ? compteDTO.getSolde() : java.math.BigDecimal.ZERO);
        compte.setClient(client);
        Compte savedCompte = compteRepository.save(compte);
        return toDTO(savedCompte);
    }
    
    @Override
    public CompteDTO updateCompte(Long id, CompteDTO compteDTO) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        
        // Mettre à jour le numéro de compte si fourni et différent
        if (compteDTO.getNumCompte() != null && !compteDTO.getNumCompte().trim().isEmpty()) {
            if (!compte.getNumCompte().equals(compteDTO.getNumCompte())) {
                // Vérifier si le nouveau numéro existe déjà
                if (compteRepository.findByNumCompte(compteDTO.getNumCompte()).isPresent()) {
                    throw new RuntimeException("Un compte avec ce numéro existe déjà");
                }
                // Valider le format IBAN
                try {
                    Iban.valueOf(compteDTO.getNumCompte());
                    compte.setNumCompte(compteDTO.getNumCompte());
                } catch (Exception e) {
                    throw new RuntimeException("Le numéro de compte fourni n'est pas un IBAN valide");
                }
            }
        }
        
        compte.setTypeCompte(compteDTO.getTypeCompte());
        compte.setSolde(compteDTO.getSolde());
        
        // Mettre à jour le client si fourni
        if (compteDTO.getClientId() != null && !compte.getClient().getId().equals(compteDTO.getClientId())) {
            Client client = clientRepository.findById(compteDTO.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + compteDTO.getClientId()));
            compte.setClient(client);
        }
        
        Compte updatedCompte = compteRepository.save(compte);
        return toDTO(updatedCompte);
    }
    
    @Override
    public void deleteCompte(Long id) {
        if (!compteRepository.existsById(id)) {
            throw new RuntimeException("Compte non trouvé avec l'ID: " + id);
        }
        compteRepository.deleteById(id);
    }
}
