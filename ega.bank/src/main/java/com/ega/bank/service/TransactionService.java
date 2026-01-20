package com.ega.bank.service;

import com.ega.bank.dto.TransactionDTO;
import com.ega.bank.entity.Compte;
import com.ega.bank.entity.Transaction;
import com.ega.bank.entity.TypeTransaction;
import com.ega.bank.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    
    /**
     * Crée une nouvelle transaction
     */
    public Transaction createTransaction(
            Compte compte,
            TypeTransaction typeTransaction,
            BigDecimal montant,
            String compteBeneficiaire,
            String description,
            BigDecimal soldeApres
    ) {
        Transaction transaction = Transaction.builder()
                .compte(compte)
                .typeTransaction(typeTransaction)
                .montant(montant)
                .compteBeneficiaire(compteBeneficiaire)
                .description(description)
                .soldeApresTransaction(soldeApres)
                .build();
        
        return transactionRepository.save(transaction);
    }
    
    /**
     * Récupère toutes les transactions d'un compte
     */
    public List<TransactionDTO> getTransactionsByCompte(Long compteId) {
        return transactionRepository.findByCompteIdOrderByDateTransactionDesc(compteId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Récupère les transactions d'un compte pour une période donnée
     */
    public List<TransactionDTO> getTransactionsByPeriode(Long compteId, LocalDate dateDebut, LocalDate dateFin) {
        LocalDateTime dateDebutTime = dateDebut.atStartOfDay();
        LocalDateTime dateFinTime = dateFin.atTime(LocalTime.MAX);
        
        return transactionRepository.findByCompteIdAndDateBetween(compteId, dateDebutTime, dateFinTime)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Récupère les transactions d'un compte par type
     */
    public List<TransactionDTO> getTransactionsByType(Long compteId, TypeTransaction type) {
        return transactionRepository.findByCompteIdAndType(compteId, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convertit une entité Transaction en DTO
     */
    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .typeTransaction(transaction.getTypeTransaction())
                .montant(transaction.getMontant())
                .dateTransaction(transaction.getDateTransaction())
                .numeroCompte(transaction.getCompte().getNumeroCompte())
                .compteBeneficiaire(transaction.getCompteBeneficiaire())
                .description(transaction.getDescription())
                .soldeApresTransaction(transaction.getSoldeApresTransaction())
                .build();
    }
}