package com.ega.banque.service;

import com.ega.banque.entity.Client;
import com.ega.banque.repository.ClientRepository;
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

    public Client creerClient(Client client) {
        // Vérifier si l'email existe déjà
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            throw new RuntimeException("Un client avec cet email existe déjà");
        }
        return clientRepository.save(client);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
    }

    public Client updateClient(Long id, Client client) {
        Client existingClient = getClientById(id);
        
        // Vérifier si l'email est modifié et s'il existe déjà
        if (!existingClient.getEmail().equals(client.getEmail()) &&
            clientRepository.findByEmail(client.getEmail()).isPresent()) {
            throw new RuntimeException("Un client avec cet email existe déjà");
        }

        existingClient.setNom(client.getNom());
        existingClient.setPrenom(client.getPrenom());
        existingClient.setDateNaissance(client.getDateNaissance());
        existingClient.setSexe(client.getSexe());
        existingClient.setAdresse(client.getAdresse());
        existingClient.setTelephone(client.getTelephone());
        existingClient.setEmail(client.getEmail());
        existingClient.setNationalite(client.getNationalite());

        return clientRepository.save(existingClient);
    }

    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client introuvable");
        }
        clientRepository.deleteById(id);
    }
}
