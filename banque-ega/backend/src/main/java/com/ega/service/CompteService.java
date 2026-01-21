package com.ega.service;

import com.ega.dto.CompteDTO;
import com.ega.exception.ResourceNotFoundException;
import com.ega.exception.UnauthorizedException;
import com.ega.mapper.CompteMapper;
import com.ega.model.Client;
import com.ega.model.Compte;
import com.ega.model.Role;
import com.ega.model.TypeCompte;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.repository.CompteRepository;
import com.ega.util.IbanGenerator;
import com.ega.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final CompteMapper compteMapper;
    private final IbanGenerator ibanGenerator;
    private final SecurityUtil securityUtil;

    public List<CompteDTO> getAllComptes() {
        User currentUser = securityUtil.getCurrentUser();
        
        // Les admins voient tous les comptes
        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return compteRepository.findAll().stream()
                    .map(compteMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        // Un utilisateur normal ne voit que ses propres comptes
        if (currentUser.getClient() == null) {
            return List.of();
        }
        return compteRepository.findByClientId(currentUser.getClient().getId()).stream()
                .map(compteMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CompteDTO getCompteById(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        
        // Les admins peuvent accéder à tous les comptes
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut accéder qu'à ses propres comptes
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à ce compte");
            }
        }
        
        return compteMapper.toDTO(compte);
    }

    public CompteDTO getCompteByNumero(String numeroCompte) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec le numéro: " + numeroCompte));
        
        // Vérifier que le compte appartient à l'utilisateur connecté
        if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
            throw new UnauthorizedException("Vous n'avez pas accès à ce compte");
        }
        
        return compteMapper.toDTO(compte);
    }

    public List<CompteDTO> getComptesByClientId(Long clientId) {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("Vous ne pouvez voir que vos propres comptes");
        }
        
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + clientId);
        }
        return compteRepository.findByClientId(clientId).stream()
                .map(compteMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<CompteDTO> getComptesByClientIdAndType(Long clientId, TypeCompte typeCompte) {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("Vous ne pouvez voir que vos propres comptes");
        }
        
        if (!clientRepository.existsById(clientId)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + clientId);
        }
        return compteRepository.findByClientIdAndTypeCompte(clientId, typeCompte).stream()
                .map(compteMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CompteDTO createCompte(CompteDTO compteDTO) {
        User currentUser = securityUtil.getCurrentUser();
        
        // Les admins peuvent créer des comptes pour n'importe quel client
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null) {
                throw new ResourceNotFoundException("Aucun client associé à votre compte");
            }
            
            // Un utilisateur normal ne peut créer un compte que pour lui-même
            if (!compteDTO.getClientId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez créer un compte que pour vous-même");
            }
        }
        
        // Vérifier que le client existe
        Client client = clientRepository.findById(compteDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + compteDTO.getClientId()));

        // Générer un numéro IBAN unique
        String numeroIban;
        do {
            numeroIban = ibanGenerator.generateIban();
        } while (compteRepository.existsByNumeroCompte(numeroIban));

        // Créer le compte
        Compte compte = new Compte();
        compte.setNumeroCompte(numeroIban);
        compte.setTypeCompte(compteDTO.getTypeCompte());
        compte.setClient(client);
        compte.setSolde(java.math.BigDecimal.ZERO); // Le solde est initialisé à 0 lors de la création

        Compte savedCompte = compteRepository.save(compte);
        return compteMapper.toDTO(savedCompte);
    }

    public CompteDTO updateCompte(Long id, CompteDTO compteDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte existingCompte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        
        // Les admins peuvent modifier tous les comptes
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut modifier que ses propres comptes
            if (currentUser.getClient() == null || !existingCompte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez modifier que vos propres comptes");
            }
        }

        // On ne permet pas de changer le numéro de compte, le client ou le solde directement
        // Seul le type de compte peut être modifié
        existingCompte.setTypeCompte(compteDTO.getTypeCompte());

        Compte updatedCompte = compteRepository.save(existingCompte);
        return compteMapper.toDTO(updatedCompte);
    }

    public void deleteCompte(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        
        // Les admins peuvent supprimer tous les comptes
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut supprimer que ses propres comptes
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez supprimer que vos propres comptes");
            }
        }
        
        // Vérifier si le compte a des transactions
        if (!compte.getTransactions().isEmpty()) {
            throw new com.ega.exception.BusinessException(
                "Impossible de supprimer le compte car il possède des transactions."
            );
        }
        
        compteRepository.delete(compte);
    }
}

