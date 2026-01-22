package com.ega.bank.bank_api.service;

import com.ega.bank.bank_api.dto.CompteDto;
import com.ega.bank.bank_api.entity.Client;
import com.ega.bank.bank_api.entity.Compte;
import com.ega.bank.bank_api.exception.ResourceNotFoundException;
import com.ega.bank.bank_api.exception.DuplicateResourceException;
import com.ega.bank.bank_api.repository.ClientRepository;
import com.ega.bank.bank_api.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompteService {
    
    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final IbanService ibanService;
    
    public List<CompteDto> getAllComptes() {
        return compteRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CompteDto getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        return convertToDto(compte);
    }
    
    public CompteDto getCompteByNumero(String numeroCompte) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec le numéro: " + numeroCompte));
        return convertToDto(compte);
    }
    
    public List<CompteDto> getComptesByClientId(Long clientId) {
        return compteRepository.findByProprietaireId(clientId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CompteDto createCompte(CompteDto compteDto) {
        // Vérifier que le client existe
        Client client = clientRepository.findById(compteDto.getProprietaireId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + compteDto.getProprietaireId()));
        
        // Générer un numéro de compte unique
        String numeroCompte;
        do {
            numeroCompte = ibanService.genererNumeroCompte();
        } while (compteRepository.existsByNumeroCompte(numeroCompte));
        
        Compte compte = new Compte();
        compte.setNumeroCompte(numeroCompte);
        compte.setTypeCompte(compteDto.getTypeCompte());
        compte.setDateCreation(LocalDateTime.now());
        compte.setSolde(BigDecimal.ZERO);
        compte.setProprietaire(client);
        
        Compte savedCompte = compteRepository.save(compte);
        return convertToDto(savedCompte);
    }
    
    public CompteDto updateCompte(Long id, CompteDto compteDto) {
        Compte existingCompte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        
        // Seul le type de compte peut être modifié
        existingCompte.setTypeCompte(compteDto.getTypeCompte());
        
        Compte updatedCompte = compteRepository.save(existingCompte);
        return convertToDto(updatedCompte);
    }
    
    public void deleteCompte(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        
        // Vérifier que le solde est nul avant suppression
        if (compte.getSolde().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Impossible de supprimer un compte avec un solde non nul");
        }
        
        compteRepository.deleteById(id);
    }
    
    public List<CompteDto> getComptesByClientIdAndType(Long clientId, Compte.TypeCompte typeCompte) {
        return compteRepository.findByProprietaireIdAndTypeCompte(clientId, typeCompte).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private CompteDto convertToDto(Compte compte) {
        CompteDto dto = new CompteDto();
        dto.setId(compte.getId());
        dto.setNumeroCompte(compte.getNumeroCompte());
        dto.setTypeCompte(compte.getTypeCompte());
        dto.setDateCreation(compte.getDateCreation());
        dto.setSolde(compte.getSolde());
        dto.setProprietaireId(compte.getProprietaire().getId());
        dto.setProprietaireNom(compte.getProprietaire().getNom());
        dto.setProprietairePrenom(compte.getProprietaire().getPrenom());
        return dto;
    }
}