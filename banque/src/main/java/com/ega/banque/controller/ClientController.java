package com.ega.banque.controller;

import com.ega.banque.model.Client;
import com.ega.banque.model.Transaction; 
import com.ega.banque.Repository.ClientRepository;
import com.ega.banque.Repository.OperationRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private OperationRepository operationRepository; // Injecté pour le graphique

    // Récupérer tous les clients
    @GetMapping
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // NOUVEAU : Récupérer toutes les transactions pour le graphique du dashboard
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return operationRepository.findAll();
    }

    // Créer un client
    @PostMapping
    public Client createClient(@RequestBody Client client) {
        return clientRepository.save(client);
    }

    // VOIR LE DÉTAIL
    @GetMapping("/{id}")
    public Client getClientById(@PathVariable Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
    }

    // MODIFIER
    @PutMapping("/{id}")
    public Client updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'id : " + id));
        
        client.setNumeroCompte(clientDetails.getNumeroCompte()); 
        client.setNom(clientDetails.getNom());
        client.setPrenom(clientDetails.getPrenom());
        client.setEmail(clientDetails.getEmail());
        client.setSolde(clientDetails.getSolde());
        client.setType(clientDetails.getType());
        client.setStatut(clientDetails.getStatut());
        
        return clientRepository.save(client);
    }

    // SUPPRIMER
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientRepository.deleteById(id);
    }
}