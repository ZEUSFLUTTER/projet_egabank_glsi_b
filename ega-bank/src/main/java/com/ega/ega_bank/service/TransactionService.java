package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.OperationRequest;
import com.ega.ega_bank.dto.TransactionDTO;
import com.ega.ega_bank.dto.VirementRequest;
import com.ega.ega_bank.exception.InsufficientBalanceException;
import com.ega.ega_bank.exception.InvalidOperationException;
import com.ega.ega_bank.exception.ResourceNotFoundException;
import com.ega.ega_bank.model.Compte;
import com.ega.ega_bank.model.Transaction;
import com.ega.ega_bank.model.TypeTransaction;
import com.ega.ega_bank.repository.CompteRepository;
import com.ega.ega_bank.repository.TransactionRepository;
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

    public TransactionDTO deposer(OperationRequest request) {
        Compte compte = compteRepository.findByNumeroCompte(request.getNumeroCompte())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + request.getNumeroCompte()));

        if (request.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Le montant doit être positif");
        }

        compte.crediter(request.getMontant());
        compteRepository.save(compte);

        Transaction transaction = Transaction.builder()
                .typeTransaction(TypeTransaction.DEPOT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : "Dépôt")
                .compte(compte)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToDTO(savedTransaction);
    }

    public TransactionDTO retirer(OperationRequest request) {
        Compte compte = compteRepository.findByNumeroCompte(request.getNumeroCompte())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + request.getNumeroCompte()));

        if (request.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Le montant doit être positif");
        }

        try {
            compte.debiter(request.getMontant());
            compteRepository.save(compte);
        } catch (IllegalStateException e) {
            throw new InsufficientBalanceException("Solde insuffisant pour effectuer le retrait");
        }

        Transaction transaction = Transaction.builder()
                .typeTransaction(TypeTransaction.RETRAIT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : "Retrait")
                .compte(compte)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToDTO(savedTransaction);
    }

    public TransactionDTO virement(VirementRequest request) {
        Compte compteSource = compteRepository.findByNumeroCompte(request.getCompteSource())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé: " + request.getCompteSource()));

        Compte compteDestinataire = compteRepository.findByNumeroCompte(request.getCompteDestinataire())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destinataire non trouvé: " + request.getCompteDestinataire()));

        if (request.getCompteSource().equals(request.getCompteDestinataire())) {
            throw new InvalidOperationException("Le compte source et destinataire ne peuvent pas être identiques");
        }

        if (request.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Le montant doit être positif");
        }

        try {
            compteSource.debiter(request.getMontant());
            compteDestinataire.crediter(request.getMontant());
            
            compteRepository.save(compteSource);
            compteRepository.save(compteDestinataire);
        } catch (IllegalStateException e) {
            throw new InsufficientBalanceException("Solde insuffisant pour effectuer le virement");
        }

        Transaction transactionDebit = Transaction.builder()
                .typeTransaction(TypeTransaction.VIREMENT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : 
                    "Virement vers " + request.getCompteDestinataire())
                .compte(compteSource)
                .compteDestinataire(request.getCompteDestinataire())
                .build();

        Transaction transactionCredit = Transaction.builder()
                .typeTransaction(TypeTransaction.VIREMENT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : 
                    "Virement depuis " + request.getCompteSource())
                .compte(compteDestinataire)
                .compteDestinataire(request.getCompteSource())
                .build();

        transactionRepository.save(transactionDebit);
        Transaction savedTransaction = transactionRepository.save(transactionCredit);

        return mapToDTO(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsByCompte(String numeroCompte) {
        if (!compteRepository.existsByNumeroCompte(numeroCompte)) {
            throw new ResourceNotFoundException("Compte non trouvé: " + numeroCompte);
        }
        return transactionRepository.findByNumeroCompte(numeroCompte).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsByPeriode(String numeroCompte, LocalDateTime dateDebut, LocalDateTime dateFin) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé: " + numeroCompte));

        return transactionRepository.findByCompteIdAndDateBetween(compte.getId(), dateDebut, dateFin).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Méthode de mapping
    private TransactionDTO mapToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .typeTransaction(transaction.getTypeTransaction())
                .montant(transaction.getMontant())
                .dateTransaction(transaction.getDateTransaction())
                .description(transaction.getDescription())
                .compteId(transaction.getCompte().getId())
                .numeroCompte(transaction.getCompte().getNumeroCompte())
                .compteDestinataire(transaction.getCompteDestinataire())
                .build();
    }
}
