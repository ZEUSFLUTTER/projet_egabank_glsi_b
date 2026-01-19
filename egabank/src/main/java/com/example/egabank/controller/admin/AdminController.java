package com.example.egabank.controller.admin;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.egabank.dto.ClientDTO;
import com.example.egabank.dto.ClientResponseDTO;

import com.example.egabank.entity.Client;
import com.example.egabank.entity.Compte;
import com.example.egabank.entity.Transaction;
import com.example.egabank.repository.CompteRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;



import com.example.egabank.repository.TransactionRepository;
import com.example.egabank.service.ClientService;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    private ClientService clientService;

    @Autowired
    private TransactionRepository transactionRepo;
    
    @Autowired
    private CompteRepository compteRepository;
    
    @PostMapping("/clients")
    public ClientResponseDTO creerClient(@RequestBody @Valid ClientDTO dto) {
        // Logique de création avec iban4j pour le compte initial
        return convertToResponseDTO(clientService.saveClient(dto));
    }

    @GetMapping("/clients")
    public List<ClientResponseDTO> getAllClients() {
        return clientService.getAllClients().stream()
            .map(this::convertToResponseDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/clients/{id}")
    public ClientResponseDTO getClientById(@PathVariable Long id) {
        return convertToResponseDTO(clientService.getClientById(id));
    }

    @PutMapping("/clients/{id}")
    public ClientResponseDTO updateClient(@PathVariable Long id, @RequestBody @Valid ClientDTO dto) {
        return convertToResponseDTO(clientService.updateClient(id, dto));
    }

    @DeleteMapping("/clients/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
    }

    @GetMapping("/clients/{id}/comptes")
    public List<Compte> getClientComptes(@PathVariable Long id) {
        return clientService.getClientComptes(id);
    }

    @GetMapping("/clients/{id}/transactions")
    public List<Transaction> getClientTransactions(@PathVariable Long id) {
        return clientService.getClientTransactions(id);
    }

    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        return clientService.getDashboardStats();
    }

    private ClientResponseDTO convertToResponseDTO(Client client) {
        // Récupérer les comptes du client
        List<Compte> comptes = compteRepository.findByProprietaire(client);
        
        return ClientResponseDTO.builder()
            .id(client.getId())
            .nom(client.getNom())
            .prenom(client.getPrenom())
            .email(client.getEmail())
            .telephone(client.getTelephone())
            .adresse(client.getAdresse())
            .dateNaissance(client.getDateNaissance())
            .sexe(client.getSexe())
            .nationalite(client.getNationalite())
            .role(client.getRole())
            .dateCreation(client.getDateCreation())
            .comptes(comptes)
            .build();
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAllWithDetails();
    }
    
    @GetMapping("/transactions/recent")
    public List<Transaction> getRecentTransactions() {
        return transactionRepo.findTop10WithDetails();
    }
}