package com.ega.bank.backend.service;

import com.ega.bank.backend.dto.client.ClientPatchDto;
import com.ega.bank.backend.dto.client.ClientUpdateDto;
import com.ega.bank.backend.entity.Client;
import com.ega.bank.backend.entity.Utilisateur;
import com.ega.bank.backend.enums.TypeUtilisateur;
import com.ega.bank.backend.exception.BusinessException;
import com.ega.bank.backend.exception.ResourceNotFoundException;
import com.ega.bank.backend.repository.ClientRepository;
import com.ega.bank.backend.repository.UtilisateurRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ClientService(
            ClientRepository clientRepository,
            UtilisateurRepository utilisateurRepository) {
        this.clientRepository = clientRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // CLIENT CONNECTÉ
    public Client getClientDuUtilisateurConnecte() {

        Utilisateur utilisateur = getUtilisateurConnecte();

        if (utilisateur.getRole() != TypeUtilisateur.CLIENT) {
            throw new BusinessException("Seul un client peut accéder à cette ressource");
        }

        if (utilisateur.getClient() == null) {
            throw new BusinessException("Aucun client associé");
        }

        return utilisateur.getClient();
    }

    // CREATE
    public Client creerClient(Client client) {
        if (clientRepository.existsByCourriel(client.getCourriel())) {
            throw new BusinessException("Email déjà utilisé");
        }
        return clientRepository.save(client);
    }

    // UPDATE
    public Client updateClient(Long id, ClientUpdateDto dto) {
        Client client = getClientById(id);

        client.setPrenom(dto.getPrenom());
        client.setNom(dto.getNom());
        client.setDateNaissance(dto.getDateNaissance());
        client.setSexe(dto.getSexe());
        client.setAdresse(dto.getAdresse());
        client.setNationalite(dto.getNationalite());
        client.setNumeroTelephone(dto.getTelephone());

        return clientRepository.save(client);
    }

    public Client patchClient(Long id, ClientPatchDto dto) {
        Client client = getClientById(id);

        if (dto.getPrenom() != null)
            client.setPrenom(dto.getPrenom());
        if (dto.getNom() != null)
            client.setNom(dto.getNom());
        if (dto.getAdresse() != null)
            client.setAdresse(dto.getAdresse());
        if (dto.getTelephone() != null)
            client.setNumeroTelephone(dto.getTelephone());

        return clientRepository.save(client);
    }

    // READ
    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable : " + id));
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // DELETE
    public void supprimerClient(Long id) {
        Client client = getClientById(id);
        clientRepository.delete(client);
    }

    // OUTILS
    private Utilisateur getUtilisateurConnecte() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return utilisateurRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new BusinessException("Utilisateur non authentifié"));
    }
}