package com.banque.controller;

import com.banque.dto.CompteDTO;
import com.banque.dto.NotificationDTO;
import com.banque.dto.TransactionDTO;
import com.banque.entity.Client;
import com.banque.entity.Compte;
import com.banque.entity.Notification;
import com.banque.repository.ClientRepository;
import com.banque.repository.CompteRepository;
import com.banque.repository.NotificationRepository;
import com.banque.repository.TransactionRepository;
import com.banque.security.JwtUtil;
import com.banque.service.TransactionService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientAuthController {
    
    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;
    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;
    
    private Client getCurrentClient(Authentication authentication) {
        String courriel = authentication.getName();
        return clientRepository.findByCourriel(courriel)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            List<Compte> comptes = compteRepository.findByClientId(client.getId());
            
            BigDecimal totalSolde = comptes.stream()
                    .map(Compte::getSolde)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            long nombreComptes = comptes.size();
            long nombreNotifications = notificationRepository.countByClientAndLuFalse(client);
            
            return ResponseEntity.ok(new DashboardResponse(
                    totalSolde,
                    nombreComptes,
                    nombreNotifications
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }
    
    @GetMapping("/comptes")
    public ResponseEntity<List<CompteDTO>> getComptes(Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            List<Compte> comptes = compteRepository.findByClientId(client.getId());
            
            List<CompteDTO> comptesDTO = comptes.stream()
                    .map(this::toCompteDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(comptesDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDTO>> getTransactions(Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            List<Compte> comptes = compteRepository.findByClientId(client.getId());
            
            List<TransactionDTO> allTransactions = comptes.stream()
                    .flatMap(compte -> transactionRepository
                            .findByCompteSourceOrCompteDestination(compte, compte)
                            .stream()
                            .map(this::toTransactionDTO))
                    .sorted((t1, t2) -> t2.getDateTransaction().compareTo(t1.getDateTransaction()))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(allTransactions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getNotifications(Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            List<Notification> notifications = notificationRepository
                    .findByClientOrderByDateNotificationDesc(client);
            
            List<NotificationDTO> notificationsDTO = notifications.stream()
                    .map(this::toNotificationDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(notificationsDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @PutMapping("/notifications/{id}/lu")
    public ResponseEntity<Void> marquerNotificationCommeLue(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
            
            if (!notification.getClient().getId().equals(client.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            notification.setLu(true);
            notificationRepository.save(notification);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping("/transactions/retrait")
    public ResponseEntity<?> effectuerRetrait(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description,
            Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            Compte compte = compteRepository.findById(compteId)
                    .orElseThrow(() -> new RuntimeException("Compte non trouvé"));
            
            // Vérifier que le compte appartient au client
            if (!compte.getClient().getId().equals(client.getId())) {
                return ResponseEntity.status(403)
                        .body(new ErrorResponse("Vous n'avez pas accès à ce compte"));
            }
            
            TransactionDTO transaction = transactionService.effectuerRetrait(compteId, montant, description);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ErrorResponse("Erreur interne du serveur"));
        }
    }
    
    @PostMapping("/transactions/virement")
    public ResponseEntity<?> effectuerVirement(
            @RequestParam Long compteSourceId,
            @RequestParam Long compteDestinationId,
            @RequestParam BigDecimal montant,
            @RequestParam(required = false) String description,
            Authentication authentication) {
        try {
            Client client = getCurrentClient(authentication);
            Compte compteSource = compteRepository.findById(compteSourceId)
                    .orElseThrow(() -> new RuntimeException("Compte source non trouvé"));
            
            // Vérifier que le compte source appartient au client
            if (!compteSource.getClient().getId().equals(client.getId())) {
                return ResponseEntity.status(403)
                        .body(new ErrorResponse("Vous n'avez pas accès à ce compte"));
            }
            
            TransactionDTO transaction = transactionService.effectuerTransfert(
                    compteSourceId, compteDestinationId, montant, description);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ErrorResponse("Erreur interne du serveur"));
        }
    }
    
    private CompteDTO toCompteDTO(Compte compte) {
        return new CompteDTO(
                compte.getId(),
                compte.getNumCompte(),
                compte.getTypeCompte(),
                compte.getDateCreation(),
                compte.getSolde(),
                compte.getClient().getId()
        );
    }
    
    private TransactionDTO toTransactionDTO(com.banque.entity.Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getTypeTransaction(),
                transaction.getMontant(),
                transaction.getDateTransaction(),
                transaction.getCompteSource() != null ? transaction.getCompteSource().getId() : null,
                transaction.getCompteDestination() != null ? transaction.getCompteDestination().getId() : null,
                transaction.getDescription()
        );
    }
    
    private NotificationDTO toNotificationDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getMessage(),
                notification.getDateNotification(),
                notification.getLu()
        );
    }
    
    // Classe interne pour la réponse du dashboard
    private static class DashboardResponse {
        private BigDecimal totalSolde;
        private long nombreComptes;
        private long nombreNotifications;
        
        public DashboardResponse(BigDecimal totalSolde, long nombreComptes, long nombreNotifications) {
            this.totalSolde = totalSolde;
            this.nombreComptes = nombreComptes;
            this.nombreNotifications = nombreNotifications;
        }
        
        public BigDecimal getTotalSolde() { return totalSolde; }
        public long getNombreComptes() { return nombreComptes; }
        public long getNombreNotifications() { return nombreNotifications; }
    }
    
    // Classe interne pour les réponses d'erreur
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ErrorResponse {
        private String message;
    }
}
