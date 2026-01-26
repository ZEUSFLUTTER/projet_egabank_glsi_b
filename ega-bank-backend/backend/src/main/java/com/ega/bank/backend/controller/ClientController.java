package com.ega.bank.backend.controller;

import com.ega.bank.backend.dto.client.ClientPatchDto;
import com.ega.bank.backend.dto.client.ClientRequestDto;
import com.ega.bank.backend.dto.client.ClientResponseDto;
import com.ega.bank.backend.dto.client.ClientUpdateDto;
import com.ega.bank.backend.entity.Client;
import com.ega.bank.backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // CREATE CLIENT
    // ADMIN / AGENT
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<ClientResponseDto> creerClient(
            @Valid @RequestBody ClientRequestDto dto) {

        Client client = new Client();
        client.setPrenom(dto.getPrenom());
        client.setNom(dto.getNom());
        client.setCourriel(dto.getEmail());
        client.setNumeroTelephone(dto.getTelephone());

        Client saved = clientService.creerClient(client);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponseDto(saved));
    }

    // CLIENT et ses propres infos
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponseDto> getMonProfil() {
        Client client = clientService.getClientDuUtilisateurConnecte();
        return ResponseEntity.ok(toResponseDto(client));
    }

    // ADMIN / AGENT Lire les infos des clients
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<ClientResponseDto> getClient(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(toResponseDto(client));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    public ResponseEntity<List<ClientResponseDto>> getAllClients() {
        List<ClientResponseDto> clients = clientService.getAllClients()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(clients);
    }

    // UPDATE
    // ADMIN UNIQUEMENT
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientResponseDto> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientUpdateDto dto) {

        Client updated = clientService.updateClient(id, dto);
        return ResponseEntity.ok(toResponseDto(updated));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClientResponseDto> patchClient(
            @PathVariable Long id,
            @RequestBody ClientPatchDto dto) {

        Client patched = clientService.patchClient(id, dto);
        return ResponseEntity.ok(toResponseDto(patched));
    }

    // DELETE
    // ADMIN UNIQUEMENT
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> supprimerClient(@PathVariable Long id) {
        clientService.supprimerClient(id);
        return ResponseEntity.noContent().build();
    }

    // MAPPER: Les informations de réponse à la requête envoyée
    private ClientResponseDto toResponseDto(Client client) {
        ClientResponseDto dto = new ClientResponseDto();
        dto.setId(client.getId());
        dto.setPrenom(client.getPrenom());
        dto.setNom(client.getNom());
        dto.setSexe(client.getSexe());
        dto.setNationalite(client.getNationalite());
        dto.setAdresse(client.getAdresse());
        dto.setDateNaissance(client.getDateNaissance());
        dto.setEmail(client.getCourriel());
        dto.setTelephone(client.getNumeroTelephone());
        return dto;
    }
}