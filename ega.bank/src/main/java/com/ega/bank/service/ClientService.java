package com.ega.bank.service;

import com.ega.bank.dto.ClientDTO;
import com.ega.bank.entity.Client;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.repository.ClientRepository;
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
    
    /**
     * Crée un nouveau client
     */
    public ClientDTO createClient(ClientDTO clientDTO) {
        // Vérification de l'unicité de l'email
        if (clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe déjà");
        }
        
        // Vérification de l'unicité du téléphone
        if (clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new IllegalArgumentException("Un client avec ce numéro de téléphone existe déjà");
        }
        
        Client client = Client.builder()
                .nom(clientDTO.getNom())
                .prenom(clientDTO.getPrenom())
                .dateNaissance(clientDTO.getDateNaissance())
                .sexe(clientDTO.getSexe())
                .adresse(clientDTO.getAdresse())
                .telephone(clientDTO.getTelephone())
                .email(clientDTO.getEmail())
                .nationalite(clientDTO.getNationalite())
                .build();
        
        Client savedClient = clientRepository.save(client);
        return convertToDTO(savedClient);
    }
    
    /**
     * Récupère un client par son ID
     */
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        return convertToDTO(client);
    }
    
    /**
     * Récupère tous les clients
     */
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Met à jour un client
     */
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        
        // Vérifier l'unicité de l'email si modifié
        if (!client.getEmail().equals(clientDTO.getEmail()) 
                && clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new IllegalArgumentException("Un client avec cet email existe déjà");
        }
        
        // Vérifier l'unicité du téléphone si modifié
        if (!client.getTelephone().equals(clientDTO.getTelephone()) 
                && clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new IllegalArgumentException("Un client avec ce numéro de téléphone existe déjà");
        }
        
        client.setNom(clientDTO.getNom());
        client.setPrenom(clientDTO.getPrenom());
        client.setDateNaissance(clientDTO.getDateNaissance());
        client.setSexe(clientDTO.getSexe());
        client.setAdresse(clientDTO.getAdresse());
        client.setTelephone(clientDTO.getTelephone());
        client.setEmail(clientDTO.getEmail());
        client.setNationalite(clientDTO.getNationalite());
        
        Client updatedClient = clientRepository.save(client);
        return convertToDTO(updatedClient);
    }
    
    /**
     * Supprime un client
     */
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + id);
        }
        clientRepository.deleteById(id);
    }
    
    /**
     * Convertit une entité Client en DTO
     */
    private ClientDTO convertToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getId())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .dateNaissance(client.getDateNaissance())
                .sexe(client.getSexe())
                .adresse(client.getAdresse())
                .telephone(client.getTelephone())
                .email(client.getEmail())
                .nationalite(client.getNationalite())
                .dateCreation(client.getDateCreation())
                .build();
    }
}