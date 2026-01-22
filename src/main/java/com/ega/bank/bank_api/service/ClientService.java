package com.ega.bank.bank_api.service;

import com.ega.bank.bank_api.dto.ClientDto;
import com.ega.bank.bank_api.entity.Client;
import com.ega.bank.bank_api.exception.ResourceNotFoundException;
import com.ega.bank.bank_api.exception.DuplicateResourceException;
import com.ega.bank.bank_api.repository.ClientRepository;
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
    
    public List<ClientDto> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public ClientDto getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        return convertToDto(client);
    }
    
    public ClientDto getClientByEmail(String email) {
        Client client = clientRepository.findByCourriel(email)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'email: " + email));
        return convertToDto(client);
    }
    
    public ClientDto createClient(ClientDto clientDto) {
        // Vérifier l'unicité de l'email
        if (clientRepository.existsByCourriel(clientDto.getCourriel())) {
            throw new DuplicateResourceException("Un client avec cet email existe déjà: " + clientDto.getCourriel());
        }
        
        // Vérifier l'unicité du téléphone
        if (clientRepository.existsByNumeroTelephone(clientDto.getNumeroTelephone())) {
            throw new DuplicateResourceException("Un client avec ce numéro de téléphone existe déjà: " + clientDto.getNumeroTelephone());
        }
        
        Client client = convertToEntity(clientDto);
        Client savedClient = clientRepository.save(client);
        return convertToDto(savedClient);
    }
    
    public ClientDto updateClient(Long id, ClientDto clientDto) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        
        // Vérifier l'unicité de l'email (sauf pour le client actuel)
        if (!existingClient.getCourriel().equals(clientDto.getCourriel()) && 
            clientRepository.existsByCourriel(clientDto.getCourriel())) {
            throw new DuplicateResourceException("Un client avec cet email existe déjà: " + clientDto.getCourriel());
        }
        
        // Vérifier l'unicité du téléphone (sauf pour le client actuel)
        if (!existingClient.getNumeroTelephone().equals(clientDto.getNumeroTelephone()) && 
            clientRepository.existsByNumeroTelephone(clientDto.getNumeroTelephone())) {
            throw new DuplicateResourceException("Un client avec ce numéro de téléphone existe déjà: " + clientDto.getNumeroTelephone());
        }
        
        // Mettre à jour les champs
        existingClient.setNom(clientDto.getNom());
        existingClient.setPrenom(clientDto.getPrenom());
        existingClient.setDateNaissance(clientDto.getDateNaissance());
        existingClient.setSexe(Client.Sexe.valueOf(clientDto.getSexe())); // Convertir String vers enum
        existingClient.setAdresse(clientDto.getAdresse());
        existingClient.setNumeroTelephone(clientDto.getNumeroTelephone());
        existingClient.setCourriel(clientDto.getCourriel());
        existingClient.setNationalite(clientDto.getNationalite());
        
        Client updatedClient = clientRepository.save(existingClient);
        return convertToDto(updatedClient);
    }
    
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + id);
        }
        clientRepository.deleteById(id);
    }
    
    public List<ClientDto> searchClients(String searchTerm) {
        return clientRepository.findBySearchTerm(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private ClientDto convertToDto(Client client) {
        ClientDto dto = new ClientDto();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setDateNaissance(client.getDateNaissance());
        dto.setSexe(client.getSexe().toString()); // Convertir enum vers String
        dto.setAdresse(client.getAdresse());
        dto.setNumeroTelephone(client.getNumeroTelephone());
        dto.setCourriel(client.getCourriel());
        dto.setNationalite(client.getNationalite());
        dto.setDateCreation(client.getDateCreation());
        return dto;
    }
    
    private Client convertToEntity(ClientDto dto) {
        Client client = new Client();
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setDateNaissance(dto.getDateNaissance());
        client.setSexe(Client.Sexe.valueOf(dto.getSexe())); // Convertir String vers enum
        client.setAdresse(dto.getAdresse());
        client.setNumeroTelephone(dto.getNumeroTelephone());
        client.setCourriel(dto.getCourriel());
        client.setNationalite(dto.getNationalite());
        return client;
    }
}