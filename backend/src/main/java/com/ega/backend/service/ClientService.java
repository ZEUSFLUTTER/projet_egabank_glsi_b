package com.ega.backend.service;

import com.ega.backend.model.Client;
import com.ega.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Client saveClient(Client client) {
        return clientRepository.save(client);
    }

    public Optional<Client> findById(String id) {
        return clientRepository.findById(id);
    }

    // ✅ Méthodes pour ClientController
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(String id) {
        return clientRepository.findById(id);
    }

    public Client updateClient(String id, Client clientDetails) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            client.setNom(clientDetails.getNom());
            client.setPrenom(clientDetails.getPrenom());
            client.setEmail(clientDetails.getEmail());
            client.setTelephone(clientDetails.getTelephone());
            client.setAdresse(clientDetails.getAdresse());
            client.setActive(clientDetails.getActive());
            return clientRepository.save(client);
        }
        return null;
    }

    public boolean deleteClient(String id) {
        if (clientRepository.existsById(id)) {
            clientRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ✅ Méthode pour AdminController
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    // ✅ Méthode pour activer/désactiver un client
    public boolean toggleClientStatus(String id) {
        Optional<Client> clientOpt = clientRepository.findById(id);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            client.setActive(!client.getActive());
            clientRepository.save(client);
            return true;
        }
        return false;
    }

    // ✅ Méthode manquante pour CompteController
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }
}