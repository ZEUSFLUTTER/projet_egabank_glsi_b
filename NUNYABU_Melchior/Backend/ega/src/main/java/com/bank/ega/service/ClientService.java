package com.bank.ega.service;

import com.bank.ega.entity.Client;
import com.bank.ega.exception.ClientNotFoundException;
import com.bank.ega.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    // Créer un client
    public Client creerClient(Client client) {
        return clientRepository.save(client);
    }

    // Lister tous les clients
    public List<Client> listerClients() {
        return clientRepository.findAll();
    }

    // Trouver un client par ID
    public Client trouverClient(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client introuvable avec l'ID : " + id));
    }

    // Mettre à jour un client
    public Client updateClient(Long id, Client clientDetails) {
        Client client = trouverClient(id);
        
        client.setNom(clientDetails.getNom());
        client.setPrenom(clientDetails.getPrenom());
        client.setDateNaissance(clientDetails.getDateNaissance());
        client.setSexe(clientDetails.getSexe());
        client.setAdresse(clientDetails.getAdresse());
        client.setTelephone(clientDetails.getTelephone());
        client.setEmail(clientDetails.getEmail());
        client.setNationalite(clientDetails.getNationalite());
        
        return clientRepository.save(client);
    }

    // Supprimer un client
    public void supprimerClient(Long id) {
        Client client = trouverClient(id);
        clientRepository.delete(client);
    }
}
