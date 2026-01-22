package com.ega.bank.bank_api.service;

import com.ega.bank.bank_api.dto.*;
import com.ega.bank.bank_api.entity.Compte;
import com.ega.bank.bank_api.entity.Transaction;
import com.ega.bank.bank_api.exception.InsufficientFundsException;
import com.ega.bank.bank_api.exception.ResourceNotFoundException;
import com.ega.bank.bank_api.repository.CompteRepository;
import com.ega.bank.bank_api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;
    
    public TransactionDto effectuerDepot(OperationDto operationDto) {
        Compte compte = compteRepository.findByNumeroCompte(operationDto.getNumeroCompte())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + operationDto.getNumeroCompte()));
        
        BigDecimal soldeAvant = compte.getSolde();
        BigDecimal nouveauSolde = soldeAvant.add(operationDto.getMontant());
        
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(Transaction.TypeTransaction.DEPOT);
        transaction.setMontant(operationDto.getMontant());
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setDescription(operationDto.getDescription() != null ? operationDto.getDescription() : "Dépôt");
        transaction.setCompte(compte);
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(nouveauSolde);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDto(savedTransaction);
    }
    
    public TransactionDto effectuerRetrait(OperationDto operationDto) {
        Compte compte = compteRepository.findByNumeroCompte(operationDto.getNumeroCompte())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + operationDto.getNumeroCompte()));
        
        BigDecimal soldeAvant = compte.getSolde();
        
        // Vérifier que le solde est suffisant
        if (soldeAvant.compareTo(operationDto.getMontant()) < 0) {
            throw new InsufficientFundsException("Solde insuffisant. Solde actuel: " + soldeAvant + 
                                               ", Montant demandé: " + operationDto.getMontant());
        }
        
        BigDecimal nouveauSolde = soldeAvant.subtract(operationDto.getMontant());
        
        compte.setSolde(nouveauSolde);
        compteRepository.save(compte);
        
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(Transaction.TypeTransaction.RETRAIT);
        transaction.setMontant(operationDto.getMontant());
        transaction.setDateTransaction(LocalDateTime.now());
        transaction.setDescription(operationDto.getDescription() != null ? operationDto.getDescription() : "Retrait");
        transaction.setCompte(compte);
        transaction.setSoldeAvant(soldeAvant);
        transaction.setSoldeApres(nouveauSolde);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDto(savedTransaction);
    }
    
    public List<TransactionDto> effectuerVirement(VirementDto virementDto) {
        // Récupérer les comptes
        Compte compteSource = compteRepository.findByNumeroCompte(virementDto.getCompteSource())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé: " + virementDto.getCompteSource()));
        
        Compte compteDestinataire = compteRepository.findByNumeroCompte(virementDto.getCompteDestinataire())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destinataire non trouvé: " + virementDto.getCompteDestinataire()));
        
        // Vérifier que le solde est suffisant
        if (compteSource.getSolde().compareTo(virementDto.getMontant()) < 0) {
            throw new InsufficientFundsException("Solde insuffisant pour le virement. Solde actuel: " + 
                                               compteSource.getSolde() + ", Montant demandé: " + virementDto.getMontant());
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
        Transaction transactionDebit = new Transaction();
        transactionDebit.setTypeTransaction(Transaction.TypeTransaction.VIREMENT_SORTANT);
        transactionDebit.setMontant(virementDto.getMontant());
        transactionDebit.setDateTransaction(dateTransaction);
        transactionDebit.setDescription(description + " vers " + virementDto.getCompteDestinataire());
        transactionDebit.setCompte(compteSource);
        transactionDebit.setCompteDestinataire(virementDto.getCompteDestinataire());
        transactionDebit.setSoldeAvant(soldeAvantSource);
        transactionDebit.setSoldeApres(nouveauSoldeSource);
        
        // Transaction de crédit
        Transaction transactionCredit = new Transaction();
        transactionCredit.setTypeTransaction(Transaction.TypeTransaction.VIREMENT_ENTRANT);
        transactionCredit.setMontant(virementDto.getMontant());
        transactionCredit.setDateTransaction(dateTransaction);
        transactionCredit.setDescription(description + " de " + virementDto.getCompteSource());
        transactionCredit.setCompte(compteDestinataire);
        transactionCredit.setCompteDestinataire(virementDto.getCompteSource());
        transactionCredit.setSoldeAvant(soldeAvantDestinataire);
        transactionCredit.setSoldeApres(nouveauSoldeDestinataire);
        
        // Sauvegarder les transactions
        Transaction savedDebit = transactionRepository.save(transactionDebit);
        Transaction savedCredit = transactionRepository.save(transactionCredit);
        
        return List.of(convertToDto(savedDebit), convertToDto(savedCredit));
    }
    
    public List<TransactionDto> getTransactionsByCompte(String numeroCompte) {
        return transactionRepository.findByCompteNumeroCompteOrderByDateTransactionDesc(numeroCompte)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<TransactionDto> getTransactionsByComptePeriode(String numeroCompte, 
                                                              LocalDateTime dateDebut, 
                                                              LocalDateTime dateFin) {
        return transactionRepository.findByNumeroCompteAndDateTransactionBetween(numeroCompte, dateDebut, dateFin)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<TransactionDto> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private TransactionDto convertToDto(Transaction transaction) {
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
}