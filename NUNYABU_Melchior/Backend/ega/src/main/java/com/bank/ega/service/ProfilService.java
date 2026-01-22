package com.bank.ega.service;

import com.bank.ega.dto.ClientDTO;
import com.bank.ega.entity.Client;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.exception.ClientNotFoundException;
import com.bank.ega.repository.ClientRepository;
import com.bank.ega.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class ProfilService {

    private final ClientRepository clientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ProfilService(ClientRepository clientRepository, UtilisateurRepository utilisateurRepository) {
        this.clientRepository = clientRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Obtenir le profil de l'utilisateur connecté
    public ClientDTO getProfilByUsername(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé: " + username));

        if (utilisateur.getClient() == null) {
            throw new ClientNotFoundException("Profil client non associé");
        }

        return convertToDTO(utilisateur.getClient());
    }

    // Mettre à jour le profil
    public ClientDTO updateProfil(String username, ClientDTO clientDTO) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé"));

        Client client = utilisateur.getClient();
        if (client == null) {
            throw new ClientNotFoundException("Profil client non trouvé");
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

        Client updated = clientRepository.save(client);
        return convertToDTO(updated);
    }

    // Convertir Client en DTO
    private ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setDateNaissance(client.getDateNaissance());
        dto.setSexe(client.getSexe());
        dto.setAdresse(client.getAdresse());
        dto.setTelephone(client.getTelephone());
        dto.setEmail(client.getEmail());
        dto.setNationalite(client.getNationalite());
        dto.setDateCreation(client.getDateCreation());
        return dto;
    }
}
