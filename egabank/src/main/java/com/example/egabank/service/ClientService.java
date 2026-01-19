package com.example.egabank.service;

import com.example.egabank.dto.ClientDTO;
import com.example.egabank.entity.Client;
import com.example.egabank.entity.Compte;
import com.example.egabank.entity.Transaction;
import com.example.egabank.entity.TypeCompte;
import com.example.egabank.repository.ClientRepository;
import com.example.egabank.repository.CompteRepository;
import com.example.egabank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import com.example.egabank.entity.Role;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepo;
    
    @Autowired
    private CompteRepository compteRepo;
    
    @Autowired
    private TransactionRepository transactionRepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @SuppressWarnings("null")
    @Transactional
    public Client saveClient(ClientDTO dto) {
        // Créer le client
        Client client = Client.builder()
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .motDePasse(passwordEncoder.encode("client123")) // Mot de passe par défaut fixe
                .adresse(dto.getAdresse())
                .dateNaissance(dto.getDateNaissance())
                .sexe(dto.getSexe())
                .nationalite(dto.getNationalite())
                .role(Role.ROLE_CLIENT)
                .premiereConnexion(true) // Forcer le changement de mot de passe
                .dateCreation(LocalDateTime.now())
                .build();
        
        // Sauvegarder le client d'abord
        client = clientRepo.save(client);
        
        // Créer le compte associé avec IBAN unique
        Compte compte = Compte.builder()
                .numeroCompte(generateNumeroCompte())
                .typeCompte(dto.getTypeCompte() != null ? dto.getTypeCompte() : TypeCompte.COURANT)
                .solde(0.0)
                .dateCreation(LocalDateTime.now())
                .proprietaire(client)
                .build();
        
        compteRepo.save(compte);
        
        return client;
    }

    public List<Client> getAllClients() {
        return clientRepo.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepo.findById(id).orElseThrow(() -> 
            new RuntimeException("Client non trouvé avec l'ID: " + id));
    }

    @Transactional
    public Client updateClient(Long id, ClientDTO dto) {
        Client client = getClientById(id);
        
        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setEmail(dto.getEmail());
        client.setTelephone(dto.getTelephone());
        client.setAdresse(dto.getAdresse());
        client.setDateNaissance(dto.getDateNaissance());
        client.setSexe(dto.getSexe());
        client.setNationalite(dto.getNationalite());
        
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            client.setMotDePasse(passwordEncoder.encode(dto.getPassword()));
        }
        
        return clientRepo.save(client);
    }

    @Transactional
    public void deleteClient(Long id) {
        Client client = getClientById(id);
        clientRepo.delete(client);
    }

    public List<Compte> getClientComptes(Long clientId) {
        Client client = getClientById(clientId);
        return compteRepo.findByProprietaire(client);
    }

    public List<Transaction> getClientTransactions(Long clientId) {
        return transactionRepo.findByClientId(clientId);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalClients = clientRepo.count();
        long totalComptes = compteRepo.count();
        
        // Calculer le solde total de tous les comptes
        Double soldeTotal = compteRepo.findAll().stream()
            .mapToDouble(compte -> compte.getSolde() != null ? compte.getSolde() : 0.0)
            .sum();
        
        long totalTransactions = transactionRepo.count();
        
        stats.put("totalClients", totalClients);
        stats.put("totalComptes", totalComptes);
        stats.put("soldeTotal", soldeTotal);
        stats.put("totalTransactions", totalTransactions);
        
        return stats;
    }
    
    private String generateNumeroCompte() {
        // Générer un IBAN togolais unique
        // Format: TG53 XXXX XXXX XXXX XXXX XXXX XX (28 caractères total)
        String bankCode = "0001"; // Code banque EGA
        String branchCode = "0001"; // Code agence
        
        String iban;
        int attempts = 0;
        
        do {
            // Générer un numéro de compte unique de 14 chiffres
            long timestamp = System.currentTimeMillis();
            long random = (long) (Math.random() * 10000);
            String accountNumber = String.format("%014d", (timestamp + random + attempts) % 100000000000000L);
            
            // Calculer les chiffres de contrôle selon la norme IBAN
            // Pour le Togo, on utilise un calcul simplifié mais unique
            String tempIban = bankCode + branchCode + accountNumber;
            int checksum = 0;
            for (int i = 0; i < tempIban.length(); i++) {
                checksum += Character.getNumericValue(tempIban.charAt(i)) * (i + 1);
            }
            int checkDigits = 97 - (checksum % 97);
            if (checkDigits == 0) checkDigits = 97;
            
            String checkDigitsStr = String.format("%02d", checkDigits);
            
            // IBAN final au format togolais
            iban = "TG" + checkDigitsStr + bankCode + branchCode + accountNumber;
            
            attempts++;
            
            // Sécurité pour éviter une boucle infinie
            if (attempts > 100) {
                throw new RuntimeException("Impossible de générer un IBAN unique après 100 tentatives");
            }
            
        } while (compteRepo.findByNumeroCompte(iban).isPresent());
        
        return iban;
    }
}
