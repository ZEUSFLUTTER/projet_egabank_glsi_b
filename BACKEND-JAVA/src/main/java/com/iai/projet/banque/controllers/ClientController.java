package com.iai.projet.banque.controllers;

import com.iai.projet.banque.entity.Client;
import com.iai.projet.banque.models.ClientDTO;
import com.iai.projet.banque.service.ClientService;
import com.iai.projet.banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {
    @Autowired
    private ClientService clientService;

    @Autowired
    private CompteService compteService;

    //    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity createClient(@RequestBody ClientDTO client) {
        try {
            ClientDTO createdClient = clientService.createWithDTO(client);
            return new ResponseEntity<>(createdClient, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity updateClient(@RequestBody Client client) {
        try {
            Client createdClient = clientService.update(client);
            return new ResponseEntity<>("Client modifié avec succès.", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteClient(@PathVariable Long id) {
        try {
            Boolean c = clientService.deleteByIdClient(id);
            return new ResponseEntity<>("Suprimer avec succès", HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/username")
    public ResponseEntity getClientByUsername(@RequestParam String username) {
        try {
            ClientDTO createdClient = clientService.getByUsername(username);
            return new ResponseEntity<>(createdClient, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}