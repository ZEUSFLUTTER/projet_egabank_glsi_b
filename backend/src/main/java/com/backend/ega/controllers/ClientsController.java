package com.backend.ega.controllers;

import com.backend.ega.dto.CreateClientRequest;
import com.backend.ega.entities.Client;
import com.backend.ega.services.ClientsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientsController {

    private final ClientsService clientsService;

    public ClientsController(ClientsService clientsService) {
        this.clientsService = clientsService;
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientsService.getAllClients();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        return clientsService.getClientById(id);
    }

    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody CreateClientRequest request) {
        return clientsService.createClientFromRequest(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody Client client) {
        return clientsService.updateClient(id, client);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        return clientsService.deleteClient(id);
    }
}
