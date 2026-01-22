package com.ega.bank.bank_api.service;

import com.ega.bank.bank_api.dto.TransactionDto;
import com.ega.bank.bank_api.entity.Compte;
import com.ega.bank.bank_api.exception.ResourceNotFoundException;
import com.ega.bank.bank_api.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleveService {
    
    private final TransactionService transactionService;
    private final CompteRepository compteRepository;
    
    public String genererReleve(String numeroCompte, LocalDateTime dateDebut, LocalDateTime dateFin) {
        // Récupérer le compte
        Compte compte = compteRepository.findByNumeroCompteWithProprietaire(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + numeroCompte));
        
        // Récupérer les transactions
        List<TransactionDto> transactions = transactionService.getTransactionsByComptePeriode(numeroCompte, dateDebut, dateFin);
        
        // Générer le relevé
        StringBuilder releve = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        releve.append("=".repeat(80)).append("\n");
        releve.append("                           BANQUE EGA                           \n");
        releve.append("                        RELEVÉ DE COMPTE                        \n");
        releve.append("=".repeat(80)).append("\n\n");
        
        // Informations du compte
        releve.append("INFORMATIONS DU COMPTE:\n");
        releve.append("-".repeat(40)).append("\n");
        releve.append(String.format("Numéro de compte: %s\n", compte.getNumeroCompte()));
        releve.append(String.format("Type de compte: %s\n", compte.getTypeCompte().getLibelle()));
        releve.append(String.format("Titulaire: %s %s\n", compte.getProprietaire().getPrenom(), compte.getProprietaire().getNom()));
        releve.append(String.format("Solde actuel: %.2f FCFA\n", compte.getSolde()));
        releve.append(String.format("Période: du %s au %s\n\n", 
                dateDebut.format(formatter), dateFin.format(formatter)));
        
        // Transactions
        releve.append("HISTORIQUE DES TRANSACTIONS:\n");
        releve.append("-".repeat(80)).append("\n");
        releve.append(String.format("%-20s %-15s %-15s %-20s %-10s\n", 
                "Date", "Type", "Montant", "Description", "Solde"));
        releve.append("-".repeat(80)).append("\n");
        
        if (transactions.isEmpty()) {
            releve.append("Aucune transaction trouvée pour cette période.\n");
        } else {
            for (TransactionDto transaction : transactions) {
                releve.append(String.format("%-20s %-15s %15.2f %-20s %10.2f\n",
                        transaction.getDateTransaction().format(formatter),
                        transaction.getTypeTransaction().getLibelle(),
                        transaction.getMontant(),
                        transaction.getDescription() != null ? transaction.getDescription() : "",
                        transaction.getSoldeApres()));
            }
        }
        
        releve.append("-".repeat(80)).append("\n");
        releve.append(String.format("Nombre de transactions: %d\n", transactions.size()));
        releve.append("\n");
        releve.append("Relevé généré le: ").append(LocalDateTime.now().format(formatter)).append("\n");
        releve.append("=".repeat(80)).append("\n");
        
        return releve.toString();
    }
}