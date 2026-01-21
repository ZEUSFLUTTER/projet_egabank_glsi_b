package com.ega.service;

import com.ega.dto.ClientDTO;
import com.ega.exception.DuplicateResourceException;
import com.ega.exception.ResourceNotFoundException;
import com.ega.exception.UnauthorizedException;
import com.ega.mapper.ClientMapper;
import com.ega.model.Client;
import com.ega.model.Role;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final SecurityUtil securityUtil;

    public List<ClientDTO> getAllClients() {
        User currentUser = securityUtil.getCurrentUser();
        
        // Les admins voient tous les clients
        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return clientRepository.findAll().stream()
                    .map(clientMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        // Un utilisateur normal ne peut voir que son propre client
        if (currentUser.getClient() == null) {
            return List.of();
        }
        return List.of(clientMapper.toDTO(currentUser.getClient()));
    }

    public ClientDTO getClientById(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        
        // Les admins ont accès à tous les clients
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut voir que son propre client
            if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à ce client");
            }
        }
        
        return clientMapper.toDTO(client);
    }

    public ClientDTO getClientByCourriel(String courriel) {
        User currentUser = securityUtil.getCurrentUser();
        Client client = clientRepository.findByCourriel(courriel)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec le courriel: " + courriel));
        
        // Les admins ont accès à tous les clients
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut voir que son propre client
            if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à ce client");
            }
        }
        
        return clientMapper.toDTO(client);
    }

    public ClientDTO createClient(ClientDTO clientDTO) {
        User currentUser = securityUtil.getCurrentUser();
        
        // Un utilisateur ne peut pas créer d'autres clients (seulement via l'inscription)
        // On permet seulement la mise à jour du client existant
        throw new UnauthorizedException("Vous ne pouvez pas créer un nouveau client. Utilisez la fonctionnalité d'inscription.");
    }

    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));

        // Vérifier que l'utilisateur modifie son propre client
        if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(existingClient.getId())) {
            throw new UnauthorizedException("Vous ne pouvez modifier que vos propres informations");
        }

        // Vérifier si le courriel existe déjà (pour un autre client)
        if (!existingClient.getCourriel().equals(clientDTO.getCourriel()) &&
            clientRepository.existsByCourriel(clientDTO.getCourriel())) {
            throw new DuplicateResourceException("Un client avec ce courriel existe déjà: " + clientDTO.getCourriel());
        }

        // Mettre à jour les champs
        existingClient.setNom(clientDTO.getNom());
        existingClient.setPrenom(clientDTO.getPrenom());
        existingClient.setDateNaissance(clientDTO.getDateNaissance());
        existingClient.setSexe(clientDTO.getSexe());
        existingClient.setAdresse(clientDTO.getAdresse());
        existingClient.setTelephone(clientDTO.getTelephone());
        existingClient.setCourriel(clientDTO.getCourriel());
        existingClient.setNationalite(clientDTO.getNationalite());

        Client updatedClient = clientRepository.save(existingClient);
        return clientMapper.toDTO(updatedClient);
    }

    public void deleteClient(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        
        // Les admins peuvent supprimer tous les clients, les utilisateurs normaux seulement leur propre client
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !currentUser.getClient().getId().equals(client.getId())) {
                throw new UnauthorizedException("Vous ne pouvez supprimer que votre propre compte");
            }
        }
        
        // Vérifier si le client a des comptes
        if (!client.getComptes().isEmpty()) {
            throw new com.ega.exception.BusinessException(
                "Impossible de supprimer le client car il possède des comptes. " +
                "Veuillez d'abord supprimer ou transférer ses comptes."
            );
        }
        
        clientRepository.delete(client);
    }
}

