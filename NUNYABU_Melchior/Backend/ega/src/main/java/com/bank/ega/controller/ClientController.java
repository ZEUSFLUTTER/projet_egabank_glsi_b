package com.bank.ega.controller;

import com.bank.ega.dto.ApiResponse;
import com.bank.ega.entity.Client;
import com.bank.ega.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Créer un client
    @PostMapping
    public ResponseEntity<ApiResponse<Client>> creerClient(@Valid @RequestBody Client client) {
        Client nouveauClient = clientService.creerClient(client);
        return ResponseEntity.ok(ApiResponse.success("Client créé avec succès", nouveauClient));
    }

    // Lister tous les clients
    @GetMapping
    public ResponseEntity<ApiResponse<List<Client>>> listerClients() {
        List<Client> clients = clientService.listerClients();
        return ResponseEntity.ok(ApiResponse.success("Clients récupérés", clients));
    }

    // Trouver un client par ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> trouverClient(@PathVariable Long id) {
        Client client = clientService.trouverClient(id);
        return ResponseEntity.ok(ApiResponse.success(client));
    }

    // Mettre à jour un client
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Client>> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody Client clientDetails) {
        Client updated = clientService.updateClient(id, clientDetails);
        return ResponseEntity.ok(ApiResponse.success("Client mis à jour avec succès", updated));
    }

    // Supprimer un client
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> supprimerClient(@PathVariable Long id) {
        clientService.supprimerClient(id);
        return ResponseEntity.ok(ApiResponse.success("Client supprimé avec succès", null));
    }
}
