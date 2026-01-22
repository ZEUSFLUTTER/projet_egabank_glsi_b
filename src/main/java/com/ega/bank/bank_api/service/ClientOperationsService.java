package com.ega.bank.bank_api.service;

import com.ega.bank.bank_api.dto.*;
import com.ega.bank.bank_api.entity.Client;
import com.ega.bank.bank_api.entity.Compte;
import com.ega.bank.bank_api.entity.Transaction;
import com.ega.bank.bank_api.entity.User;
import com.ega.bank.bank_api.exception.InsufficientFundsException;
import com.ega.bank.bank_api.exception.ResourceNotFoundException;
import com.ega.bank.bank_api.repository.ClientRepository;
import com.ega.bank.bank_api.repository.CompteRepository;
import com.ega.bank.bank_api.repository.TransactionRepository;
import com.ega.bank.bank_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service pour les opérations bancaires spécifiques au client connecté
 * Conforme au cahier des charges : "possibilités pour un client de..."
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ClientOperationsService {
    
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final TransactionRepository transactionRepository;
    
    /**
     * Effectuer un dépôt sur le compte du client connecté
     */
    public TransactionDto effectuerDepotClient(String username, String numeroCompte, OperationClientDto operationDto) {
        Client client = getClientByUsername(username);
        Compte compte = getCompteByNumeroAndVerifyOwnership(numeroCompte, client);
        
        BigDecimal soldeAvant = compte.getSolde();
        BigDecimal nouveauSolde = soldeAvant.add(operationDto.getMontant());
        
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        
        Transaction transaction = createTransaction(
            Transaction.TypeTransaction.DEPOT,
            operationDto.getMontant(),
            operationDto.getDescription() != null ? operationDto.getDescription() : "Dépôt",
            compte,
            null,
            soldeAvant,
            nouveauSolde
        );
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertTransactionToDto(savedTransaction);
    }
    
    /**
     * Effectuer un retrait sur le compte du client connecté si le solde le permet
     */
    public TransactionDto effectuerRetraitClient(String username, String numeroCompte, OperationClientDto operationDto) {
        Client client = getClientByUsername(username);
        Compte compte = getCompteByNumeroAndVerifyOwnership(numeroCompte, client);
        
        BigDecimal soldeAvant = compte.getSolde();
        
        // Vérifier que le solde est suffisant
        if (soldeAvant.compareTo(operationDto.getMontant()) < 0) {
            throw new InsufficientFundsException(
                String.format("Solde insuffisant sur le compte %s. Solde actuel: %s XOF, Montant demandé: %s XOF", 
                    numeroCompte, soldeAvant, operationDto.getMontant()));
        }
        
        BigDecimal nouveauSolde = soldeAvant.subtract(operationDto.getMontant());
        
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        
        Transaction transaction = createTransaction(
            Transaction.TypeTransaction.RETRAIT,
            operationDto.getMontant(),
            operationDto.getDescription() != null ? operationDto.getDescription() : "Retrait",
            compte,
            null,
            soldeAvant,
            nouveauSolde
        );
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertTransactionToDto(savedTransaction);
    }
    
    /**
     * Effectuer un virement d'un compte du client à un autre compte
     */
    public List<TransactionDto> effectuerVirementClient(String username, VirementClientDto virementDto) {
        Client client = getClientByUsername(username);
        
        // Vérifier que le compte source appartient au client
        Compte compteSource = getCompteByNumeroAndVerifyOwnership(virementDto.getCompteSource(), client);
        
        // Le compte destinataire peut appartenir à n'importe qui
        Compte compteDestinataire = compteRepository.findByNumeroCompte(virementDto.getCompteDestinataire())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destinataire non trouvé: " + virementDto.getCompteDestinataire()));
        
        // Vérifier que le solde est suffisant
        if (compteSource.getSolde().compareTo(virementDto.getMontant()) < 0) {
            throw new InsufficientFundsException(
                String.format("Solde insuffisant pour le virement. Solde actuel: %s XOF, Montant demandé: %s XOF", 
                    compteSource.getSolde(), virementDto.getMontant()));
        }
        
        // Effectuer le débit sur le compte source
        BigDecimal soldeAvantSource = compteSource.getSolde();
        BigDecimal nouveauSoldeSource = soldeAvantSource.subtract(virementDto.getMontant());
        compteSource.setSolde(nouveauSoldeSource);
        
        // Effectuer le crédit sur le compte destinataire
        BigDecimal soldeAvantDestinataire = compteDestinataire.getSolde();
        BigDecimal nouveauSoldeDestinataire = soldeAvantDestinataire.add(virementDto.getMontant());
        compteDestinataire.setSolde(nouveauSoldeDestinataire);
        
        // Sauvegarder les comptes
        compteRepository.save(compteSource);
        compteRepository.save(compteDestinataire);
        
        // Créer les transactions
        LocalDateTime dateTransaction = LocalDateTime.now();
        String description = virementDto.getDescription() != null ? virementDto.getDescription() : "Virement";
        
        // Transaction de débit
        Transaction transactionDebit = createTransaction(
            Transaction.TypeTransaction.VIREMENT_SORTANT,
            virementDto.getMontant(),
            description + " vers " + virementDto.getCompteDestinataire(),
            compteSource,
            virementDto.getCompteDestinataire(),
            soldeAvantSource,
            nouveauSoldeSource
        );
        
        // Transaction de crédit
        Transaction transactionCredit = createTransaction(
            Transaction.TypeTransaction.VIREMENT_ENTRANT,
            virementDto.getMontant(),
            description + " de " + virementDto.getCompteSource(),
            compteDestinataire,
            virementDto.getCompteSource(),
            soldeAvantDestinataire,
            nouveauSoldeDestinataire
        );
        
        // Sauvegarder les transactions
        Transaction savedDebit = transactionRepository.save(transactionDebit);
        Transaction savedCredit = transactionRepository.save(transactionCredit);
        
        return List.of(convertTransactionToDto(savedDebit), convertTransactionToDto(savedCredit));
    }
    
    /**
     * Obtenir toutes les transactions d'un compte du client
     */
    public List<TransactionDto> getTransactionsClient(String username, String numeroCompte) {
        Client client = getClientByUsername(username);
        Compte compte = getCompteByNumeroAndVerifyOwnership(numeroCompte, client);
        
        return transactionRepository.findByCompteNumeroCompteOrderByDateTransactionDesc(numeroCompte)
                .stream()
                .map(this::convertTransactionToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtenir les transactions d'un compte du client pour une période donnée
     */
    public List<TransactionDto> getTransactionsClientPeriode(String username, String numeroCompte, 
                                                           LocalDateTime dateDebut, LocalDateTime dateFin) {
        Client client = getClientByUsername(username);
        Compte compte = getCompteByNumeroAndVerifyOwnership(numeroCompte, client);
        
        return transactionRepository.findByNumeroCompteAndDateTransactionBetween(numeroCompte, dateDebut, dateFin)
                .stream()
                .map(this::convertTransactionToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Générer le relevé d'un compte du client
     */
    public String genererReleveClient(String username, String numeroCompte, 
                                    LocalDateTime dateDebut, LocalDateTime dateFin) {
        Client client = getClientByUsername(username);
        Compte compte = getCompteByNumeroAndVerifyOwnership(numeroCompte, client);
        
        List<Transaction> transactions = transactionRepository
                .findByNumeroCompteAndDateTransactionBetween(numeroCompte, dateDebut, dateFin);
        
        return genererReleveTexte(client, compte, transactions, dateDebut, dateFin);
    }
    
    /**
     * Obtenir tous les comptes du client connecté
     */
    public List<CompteDto> getComptesClient(String username) {
        Client client = getClientByUsername(username);
        
        return compteRepository.findByProprietaireId(client.getId())
                .stream()
                .map(this::convertCompteToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtenir le profil du client connecté
     */
    public ClientDto getProfilClient(String username) {
        Client client = getClientByUsername(username);
        return convertClientToDto(client);
    }
    
    // Méthodes utilitaires privées
    
    private Client getClientByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé: " + username));
        
        return clientRepository.findByCourriel(user.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé pour l'utilisateur: " + username));
    }
    
    private Compte getCompteByNumeroAndVerifyOwnership(String numeroCompte, Client client) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + numeroCompte));
        
        if (!compte.getProprietaire().getId().equals(client.getId())) {
            throw new AccessDeniedException("Vous n'êtes pas autorisé à accéder à ce compte");
        }
        
        return compte;
    }
    
    private Transaction createTransaction(Transaction.TypeTransaction type, BigDecimal montant, 
                                       String description, Compte compte, String compteDestinataire,
                                       BigDecimal soldeAvant, BigDecimal soldeApres) {
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(type);
        transaction.setMontant(montant);
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setDescription(description);
        transaction.setCompte(compte);
        transaction.setCompteDestinataire(compteDestinataire);
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(soldeApres);
        return transaction;
    }
    
    private String genererReleveTexte(Client client, Compte compte, List<Transaction> transactions,
                                    LocalDateTime dateDebut, LocalDateTime dateFin) {
        StringBuilder releve = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        releve.append("=".repeat(80)).append("\n");
        releve.append("                           RELEVÉ DE COMPTE\n");
        releve.append("=".repeat(80)).append("\n\n");
        
        releve.append("Client: ").append(client.getNom()).append(" ").append(client.getPrenom()).append("\n");
        releve.append("Compte: ").append(compte.getNumeroCompte()).append("\n");
        releve.append("Type: ").append(compte.getTypeCompte()).append("\n");
        releve.append("Période: du ").append(dateDebut.format(formatter))
               .append(" au ").append(dateFin.format(formatter)).append("\n");
        releve.append("Solde actuel: ").append(compte.getSolde()).append(" XOF\n\n");
        
        releve.append("-".repeat(80)).append("\n");
        releve.append(String.format("%-20s %-15s %-10s %-25s %s\n", 
                "DATE", "TYPE", "MONTANT", "DESCRIPTION", "SOLDE"));
        releve.append("-".repeat(80)).append("\n");
        
        for (Transaction transaction : transactions) {
            releve.append(String.format("%-20s %-15s %10.2f %-25s %10.2f\n",
                    transaction.getDateTransaction().format(formatter),
                    transaction.getTypeTransaction().toString(),
                    transaction.getMontant(),
                    transaction.getDescription(),
                    transaction.getSoldeApres()));
        }
        
        releve.append("-".repeat(80)).append("\n");
        releve.append("Nombre de transactions: ").append(transactions.size()).append("\n");
        
        return releve.toString();
    }
    
    private TransactionDto convertTransactionToDto(Transaction transaction) {
        TransactionDto dto = new TransactionDto();
        dto.setId(transaction.getId());
        dto.setTypeTransaction(transaction.getTypeTransaction());
        dto.setMontant(transaction.getMontant());
        dto.setDateTransaction(transaction.getDateTransaction());
        dto.setDescription(transaction.getDescription());
        dto.setCompteId(transaction.getCompte().getId());
        dto.setNumeroCompte(transaction.getCompte().getNumeroCompte());
        dto.setCompteDestinataire(transaction.getCompteDestinataire());
        dto.setSoldeAvant(transaction.getSoldeAvant());
        dto.setSoldeApres(transaction.getSoldeApres());
        return dto;
    }
    
    private CompteDto convertCompteToDto(Compte compte) {
        CompteDto dto = new CompteDto();
        dto.setId(compte.getId());
        dto.setNumeroCompte(compte.getNumeroCompte());
        dto.setTypeCompte(compte.getTypeCompte());
        dto.setDateCreation(compte.getDateCreation());
        dto.setSolde(compte.getSolde());
        dto.setProprietaireId(compte.getProprietaire().getId());
        dto.setProprietaireNom(compte.getProprietaire().getNom());
        dto.setProprietairePrenom(compte.getProprietaire().getPrenom());
        return dto;
    }
    
    private ClientDto convertClientToDto(Client client) {
        ClientDto dto = new ClientDto();
        dto.setId(client.getId());
        dto.setNom(client.getNom());
        dto.setPrenom(client.getPrenom());
        dto.setDateNaissance(client.getDateNaissance());
        dto.setSexe(client.getSexe().toString()); // Convertir enum vers String
        dto.setAdresse(client.getAdresse());
        dto.setNumeroTelephone(client.getNumeroTelephone());
        dto.setCourriel(client.getCourriel());
        dto.setNationalite(client.getNationalite());
        dto.setDateCreation(client.getDateCreation());
        return dto;
    }
}