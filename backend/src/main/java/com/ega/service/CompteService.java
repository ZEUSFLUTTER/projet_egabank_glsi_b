package com.ega.service;

import com.ega.dto.CompteDTO;
import com.ega.mapper.CompteMapper;
import com.ega.model.Client;
import com.ega.model.Compte;
import com.ega.repository.ClientRepository;
import com.ega.repository.CompteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final CompteMapper compteMapper;

    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll()
                .stream()
                .map(compteMapper::toDTO)
                .toList();
    }

    public CompteDTO getCompteById(Long id) {
        Compte compte = getCompteEntity(id);
        return compteMapper.toDTO(compte);
    }

    public CompteDTO createCompte(CompteDTO dto) {

        if (compteRepository.findByNumeroCompte(dto.getNumeroCompte()).isPresent()) {
            throw new IllegalArgumentException("Numéro de compte déjà existant");
        }

        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client introuvable"));

        Compte compte = compteMapper.toEntity(dto);
        compte.setClient(client);
        compte.setActif(true);

        return compteMapper.toDTO(compteRepository.save(compte));
    }

    public CompteDTO updateCompte(Long id, CompteDTO dto) {
        Compte compte = getCompteEntity(id);

        compte.setTypeCompte(dto.getTypeCompte());
        compte.setSolde(dto.getSolde());

        return compteMapper.toDTO(compte);
    }

    public void desactiverCompte(Long id) {
        Compte compte = getCompteEntity(id);
        compte.setActif(false);
    }

    public void activerCompte(Long id) {
        Compte compte = getCompteEntity(id);
        compte.setActif(true);
    }

    public void deleteCompte(Long id) {
        Compte compte = getCompteEntity(id);

        if (compte.getSolde().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Impossible de supprimer un compte avec un solde non nul");
        }

        compteRepository.delete(compte);
    }

    private Compte getCompteEntity(Long id) {
        return compteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Compte introuvable"));
    }
}
