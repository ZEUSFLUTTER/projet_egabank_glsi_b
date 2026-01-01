package com.ega.banking.service;

import com.ega.banking.dto.ClientDTO;
import com.ega.banking.exception.DuplicateResourceException;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.Client;
import com.ega.banking.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientDTO creerClient(ClientDTO clientDTO) {
        log.info("Création d'un nouveau client: {}", clientDTO.getEmail());

        // Vérifier si l'email existe déjà
        if (clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new DuplicateResourceException("Client", "email", clientDTO.getEmail());
        }

        // Vérifier si le téléphone existe déjà
        if (clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new DuplicateResourceException("Client", "téléphone", clientDTO.getTelephone());
        }

        Client client = mapToEntity(clientDTO);
        Client savedClient = clientRepository.save(client);

        log.info("Client créé avec succès: ID={}", savedClient.getId());
        return mapToDTO(savedClient);
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> obtenirTousLesClients() {
        log.info("Récupération de tous les clients");
        return clientRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClientDTO obtenirClientParId(Long id) {
        log.info("Récupération du client: ID={}", id);
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        return mapToDTO(client);
    }

    @Transactional(readOnly = true)
    public ClientDTO obtenirClientParEmail(String email) {
        log.info("Récupération du client par email: {}", email);
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "email", email));
        return mapToDTO(client);
    }

    public ClientDTO modifierClient(Long id, ClientDTO clientDTO) {
        log.info("Modification du client: ID={}", id);

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));

        // Vérifier l'unicité de l'email si modifié
        if (!client.getEmail().equals(clientDTO.getEmail()) &&
                clientRepository.existsByEmail(clientDTO.getEmail())) {
            throw new DuplicateResourceException("Client", "email", clientDTO.getEmail());
        }

        // Vérifier l'unicité du téléphone si modifié
        if (!client.getTelephone().equals(clientDTO.getTelephone()) &&
                clientRepository.existsByTelephone(clientDTO.getTelephone())) {
            throw new DuplicateResourceException("Client", "téléphone", clientDTO.getTelephone());
        }

        // Mettre à jour les champs
        client.setNom(clientDTO.getNom());
        client.setPrenom(clientDTO.getPrenom());
        client.setDateNaissance(clientDTO.getDateNaissance());
        client.setSexe(clientDTO.getSexe());
        client.setAdresse(clientDTO.getAdresse());
        client.setTelephone(clientDTO.getTelephone());
        client.setEmail(clientDTO.getEmail());
        client.setNationalite(clientDTO.getNationalite());

        Client updatedClient = clientRepository.save(client);
        log.info("Client modifié avec succès: ID={}", id);

        return mapToDTO(updatedClient);
    }

    public void supprimerClient(Long id) {
        log.info("Suppression du client: ID={}", id);

        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Client", "id", id);
        }

        clientRepository.deleteById(id);
        log.info("Client supprimé avec succès: ID={}", id);
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
