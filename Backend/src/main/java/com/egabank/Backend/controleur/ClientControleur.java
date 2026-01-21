/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.ClientCreationDTO;
import com.egabank.Backend.entity.Client;
import com.egabank.Backend.service.ClientService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/clients")
public class ClientControleur {
    private final ClientService serviceClients;

    public ClientControleur(ClientService serviceClients) {
        this.serviceClients = serviceClients;
    }

    @GetMapping public List<Client> lister() { return serviceClients.lister(); }
    @GetMapping("/sans-comptes") public List<Client> listerClientsSansComptes() { return serviceClients.listerClientsSansComptes(); }
    @GetMapping("/{id}") public Client trouver(@PathVariable Long id) { return serviceClients.trouver(id); }
    @PostMapping public Client creer(@Valid @RequestBody ClientCreationDTO dto) { return serviceClients.creer(dto); }
    @PutMapping("/{id}") public Client modifier(@PathVariable Long id, @Valid @RequestBody ClientCreationDTO dto) { return serviceClients.modifier(id, dto); }
    @DeleteMapping("/{id}") public void supprimer(@PathVariable Long id) { serviceClients.supprimer(id); }
}
