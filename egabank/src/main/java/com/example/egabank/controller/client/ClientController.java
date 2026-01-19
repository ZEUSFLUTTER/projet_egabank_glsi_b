package com.example.egabank.controller.client;
import com.example.egabank.dto.VirementRequest;
import com.example.egabank.entity.Client;
import com.example.egabank.entity.Compte;
import com.example.egabank.entity.Transaction;
import com.example.egabank.entity.TypeTransaction;
import com.example.egabank.entity.Statut;
import com.example.egabank.repository.ClientRepository;
import com.example.egabank.repository.CompteRepository;
import com.example.egabank.repository.TransactionRepository;
import com.example.egabank.service.TransactionService;
import com.example.egabank.service.MobileMoneyService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private TransactionService transactionService; 
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private CompteRepository compteRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private MobileMoneyService mobileMoneyService;

    @GetMapping("/me/solde")
    public ResponseEntity<Map<String, Object>> getSolde(Authentication authentication) {
        String email = authentication.getName();
        
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Client client = clientOpt.get();
        
        // Récupérer le premier compte du client (on peut avoir plusieurs comptes)
        Optional<Compte> compteOpt = compteRepository.findByProprietaire(client).stream().findFirst();
        if (compteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Compte compte = compteOpt.get();
        
        Map<String, Object> response = new HashMap<>();
        response.put("solde", compte.getSolde());
        response.put("iban", compte.getNumeroCompte());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/virement")
    public ResponseEntity<?> virement(@RequestBody @Valid VirementRequest req) {
        transactionService.effectuerVirement(req); 
        return ResponseEntity.ok("Virement réussi");
    }
    
    @PostMapping("/mobile-money/depot")
    public ResponseEntity<Map<String, Object>> depotMobileMoney(@RequestBody Map<String, Object> request, Authentication authentication) {
        String email = authentication.getName();
        String telephone = (String) request.get("telephone");
        Double montant = Double.valueOf(request.get("montant").toString());
        String provider = (String) request.get("provider");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation rapide
            if (telephone == null || telephone.length() != 8) {
                response.put("success", false);
                response.put("message", "Numéro de téléphone invalide (8 chiffres requis)");
                return ResponseEntity.ok(response);
            }
            
            if (montant < 500 || montant > 500000) {
                response.put("success", false);
                response.put("message", "Montant invalide (entre 500 et 500,000 FCFA)");
                return ResponseEntity.ok(response);
            }
            
            // Simulation du paiement (plus rapide)
            boolean success = mobileMoneyService.simulatePayment(telephone, montant, provider);
            
            if (success) {
                // Récupérer le client et son compte
                Optional<Client> clientOpt = clientRepository.findByEmail(email);
                if (clientOpt.isPresent()) {
                    Client client = clientOpt.get();
                    Optional<Compte> compteOpt = compteRepository.findByProprietaire(client).stream().findFirst();
                    
                    if (compteOpt.isPresent()) {
                        Compte compte = compteOpt.get();
                        
                        // Ajouter le montant au solde
                        compte.setSolde(compte.getSolde() + montant);
                        compteRepository.save(compte);
                        
                        // Créer une transaction
                        Transaction transaction = Transaction.builder()
                            .typeTransaction(TypeTransaction.DEPOT)
                            .montant(montant)
                            .dateTransaction(LocalDateTime.now())
                            .compteDestination(compte)
                            .statut(Statut.VALIDE)
                            .description("Dépôt " + provider + " - " + telephone)
                            .build();
                        
                        transactionRepository.save(transaction);
                        
                        response.put("success", true);
                        response.put("message", "Dépôt de " + montant.intValue() + " FCFA effectué avec succès via " + provider);
                        response.put("nouveauSolde", compte.getSolde());
                        response.put("transactionId", transaction.getId());
                    } else {
                        response.put("success", false);
                        response.put("message", "Compte non trouvé");
                    }
                } else {
                    response.put("success", false);
                    response.put("message", "Client non trouvé");
                }
            } else {
                response.put("success", false);
                response.put("message", "Échec de la transaction " + provider + ". Veuillez réessayer.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors du traitement de la transaction");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/mobile-money/retrait")
    public ResponseEntity<Map<String, Object>> retraitMobileMoney(@RequestBody Map<String, Object> request, Authentication authentication) {
        String email = authentication.getName();
        String telephone = (String) request.get("telephone");
        Double montant = Double.valueOf(request.get("montant").toString());
        String provider = (String) request.get("provider");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validation rapide
            if (telephone == null || telephone.length() != 8) {
                response.put("success", false);
                response.put("message", "Numéro de téléphone invalide (8 chiffres requis)");
                return ResponseEntity.ok(response);
            }
            
            if (montant < 500 || montant > 500000) {
                response.put("success", false);
                response.put("message", "Montant invalide (entre 500 et 500,000 FCFA)");
                return ResponseEntity.ok(response);
            }
            
            // Récupérer le client et son compte
            Optional<Client> clientOpt = clientRepository.findByEmail(email);
            if (clientOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Client non trouvé");
                return ResponseEntity.ok(response);
            }
            
            Client client = clientOpt.get();
            Optional<Compte> compteOpt = compteRepository.findByProprietaire(client).stream().findFirst();
            
            if (compteOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Compte non trouvé");
                return ResponseEntity.ok(response);
            }
            
            Compte compte = compteOpt.get();
            
            // Vérifier le solde
            if (compte.getSolde() < montant) {
                response.put("success", false);
                response.put("message", "Solde insuffisant. Solde actuel: " + compte.getSolde().intValue() + " FCFA");
                return ResponseEntity.ok(response);
            }
            
            // Simulation du paiement
            boolean success = mobileMoneyService.simulatePayment(telephone, montant, provider);
            
            if (success) {
                // Déduire le montant du solde
                compte.setSolde(compte.getSolde() - montant);
                compteRepository.save(compte);
                
                // Créer une transaction
                Transaction transaction = Transaction.builder()
                    .typeTransaction(TypeTransaction.RETRAIT)
                    .montant(montant)
                    .dateTransaction(LocalDateTime.now())
                    .compteSource(compte)
                    .statut(Statut.VALIDE)
                    .description("Retrait " + provider + " - " + telephone)
                    .build();
                
                transactionRepository.save(transaction);
                
                response.put("success", true);
                response.put("message", "Retrait de " + montant.intValue() + " FCFA effectué avec succès via " + provider);
                response.put("nouveauSolde", compte.getSolde());
                response.put("transactionId", transaction.getId());
            } else {
                response.put("success", false);
                response.put("message", "Échec de la transaction " + provider + ". Veuillez réessayer.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Erreur lors du traitement de la transaction");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me/profile")
    public ResponseEntity<Client> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(clientOpt.get());
    }
    
    @PutMapping("/me/profile")
    public ResponseEntity<Client> updateMyProfile(@RequestBody Map<String, Object> profileData, Authentication authentication) {
        String email = authentication.getName();
        
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Client client = clientOpt.get();
        
        // Mettre à jour les champs
        if (profileData.containsKey("nom")) {
            client.setNom((String) profileData.get("nom"));
        }
        if (profileData.containsKey("prenom")) {
            client.setPrenom((String) profileData.get("prenom"));
        }
        if (profileData.containsKey("email")) {
            client.setEmail((String) profileData.get("email"));
        }
        if (profileData.containsKey("telephone")) {
            client.setTelephone((String) profileData.get("telephone"));
        }
        if (profileData.containsKey("adresse")) {
            client.setAdresse((String) profileData.get("adresse"));
        }
        if (profileData.containsKey("dateNaissance")) {
            String dateStr = (String) profileData.get("dateNaissance");
            if (dateStr != null && !dateStr.isEmpty()) {
                client.setDateNaissance(LocalDate.parse(dateStr));
            }
        }
        if (profileData.containsKey("sexe")) {
            client.setSexe((String) profileData.get("sexe"));
        }
        if (profileData.containsKey("nationalite")) {
            client.setNationalite((String) profileData.get("nationalite"));
        }
        
        Client savedClient = clientRepository.save(client);
        return ResponseEntity.ok(savedClient);
    }
}