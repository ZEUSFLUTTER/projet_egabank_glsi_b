package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.ClientDTO;
import com.ega.ega_bank.exception.DuplicateResourceException;
import com.ega.ega_bank.exception.ResourceNotFoundException;
import com.ega.ega_bank.model.Client;
import com.ega.ega_bank.repository.ClientRepository;
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

    public ClientDTO createClient(ClientDTO clientDTO) {
        // Vérifier si email existe
        if (clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new DuplicateResourceException("Un client avec cet email existe déjà");
        }
        // Vérifier si téléphone existe
        if (clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new DuplicateResourceException("Un client avec ce numéro de téléphone existe déjà");
        }

        Client client = mapToEntity(clientDTO);
        Client savedClient = clientRepository.save(client);
        return mapToDTO(savedClient);
    }

    @Transactional(readOnly = true)
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));
        return mapToDTO(client);
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + id));

        // Vérifier email si modifié
        if (!client.getEmail().equals(clientDTO.getEmail()) &&
                clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new DuplicateResourceException("Un autre client utilise déjà cet email");
        }

        // Vérifier téléphone si modifié
        if (!client.getTelephone().equals(clientDTO.getTelephone()) &&
                clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new DuplicateResourceException("Un autre client utilise déjà ce numéro de téléphone");
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
        return mapToDTO(updatedClient);
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client non trouvé avec l'ID: " + id);
        }
        clientRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> searchClients(String searchTerm) {
        return clientRepository.searchClients(searchTerm).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Méthodes de mapping
    private ClientDTO mapToDTO(Client client) {
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
                .nombreComptes(client.getComptes() != null ? client.getComptes().size() : 0)
                .build();
    }

    private Client mapToEntity(ClientDTO dto) {
        return Client.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .dateNaissance(dto.getDateNaissance())
                .sexe(dto.getSexe())
                .adresse(dto.getAdresse())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .nationalite(dto.getNationalite())
                .build();
    }
}
