package com.ega.banking.controller;

import com.ega.banking.dto.ClientDTO;
import com.ega.banking.dto.CompteDTO;
import com.ega.banking.service.ClientService;
import com.ega.banking.service.CompteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@Tag(name = "Clients", description = "API de gestion des clients")
public class ClientController {

    private final ClientService clientService;
    private final CompteService compteService;

    @PostMapping
    @Operation(summary = "Créer un nouveau client")
    public ResponseEntity<ClientDTO> creerClient(@Valid @RequestBody ClientDTO clientDTO) {
        return new ResponseEntity<>(clientService.creerClient(clientDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Obtenir tous les clients")
    public ResponseEntity<List<ClientDTO>> obtenirTousLesClients() {
        return ResponseEntity.ok(clientService.obtenirTousLesClients());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un client par ID")
    public ResponseEntity<ClientDTO> obtenirClientParId(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.obtenirClientParId(id));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Obtenir un client par email")
    public ResponseEntity<ClientDTO> obtenirClientParEmail(@PathVariable String email) {
        return ResponseEntity.ok(clientService.obtenirClientParEmail(email));
    }

    @GetMapping("/me")
    @Operation(summary = "Obtenir le profil du client connecté")
    public ResponseEntity<ClientDTO> obtenirMonProfil() {
        return ResponseEntity.ok(clientService.obtenirClientConnecte());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un client")
    public ResponseEntity<ClientDTO> modifierClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.modifierClient(id, clientDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un client")
    public ResponseEntity<Void> supprimerClient(@PathVariable Long id) {
        clientService.supprimerClient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/comptes")
    @Operation(summary = "Obtenir tous les comptes d'un client")
    public ResponseEntity<List<CompteDTO>> obtenirComptesParClient(@PathVariable Long id) {
        return ResponseEntity.ok(compteService.obtenirComptesParClient(id));
    }
}
