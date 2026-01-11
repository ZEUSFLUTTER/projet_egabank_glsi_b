package com.ega.bank_backend.controller;

import com.ega.bank_backend.dto.ClientRequestDTO;
import com.ega.bank_backend.dto.ClientResponseDTO;
import com.ega.bank_backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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

    @PostMapping
    public ResponseEntity<ClientResponseDTO> createClient(@Valid @RequestBody ClientRequestDTO dto) {
        return new ResponseEntity<>(clientService.createClient(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public List<ClientResponseDTO> getAllClients() {
        return clientService.getAllClients();
    }

    @GetMapping("/{id}")
    public ClientResponseDTO getClientById(@PathVariable Long id) {
        return clientService.getClientById(id);
    }

    @PutMapping("/{id}")
    public ClientResponseDTO updateClient(@PathVariable Long id, @Valid @RequestBody ClientRequestDTO dto) {
        return clientService.updateClient(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }
}
