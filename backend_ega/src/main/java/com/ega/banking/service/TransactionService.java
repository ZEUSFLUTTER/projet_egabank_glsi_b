package com.ega.banking.service;

import com.ega.banking.dto.*;
import com.ega.banking.exception.InsufficientBalanceException;
import com.ega.banking.exception.InvalidOperationException;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.Compte;
import com.ega.banking.model.Transaction;
import com.ega.banking.model.TypeTransaction;
import com.ega.banking.repository.CompteRepository;
import com.ega.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    public TransactionDTO effectuerDepot(DepotRequest request) {
        log.info("Dépôt de {} sur le compte ID={}", request.getMontant(), request.getCompteId());

        Compte compte = compteRepository.findById(request.getCompteId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", request.getCompteId()));

        BigDecimal soldePrecedent = compte.getSolde();

        // Effectuer le dépôt
        compte.crediter(request.getMontant());
        compteRepository.save(compte);

        // Créer la transaction
        Transaction transaction = Transaction.builder()
                .type(TypeTransaction.DEPOT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : "Dépôt d'espèces")
                .compteDestination(compte)
                .soldePrecedent(soldePrecedent)
                .nouveauSolde(compte.getSolde())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Dépôt effectué avec succès. Transaction ID={}", savedTransaction.getId());

        return mapToDTO(savedTransaction);
    }

    public TransactionDTO effectuerRetrait(RetraitRequest request) {
        log.info("Retrait de {} du compte ID={}", request.getMontant(), request.getCompteId());

        Compte compte = compteRepository.findById(request.getCompteId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", request.getCompteId()));

        BigDecimal soldePrecedent = compte.getSolde();

        // Effectuer le retrait (la méthode debiter vérifie le solde)
        try {
            compte.debiter(request.getMontant());
            compteRepository.save(compte);
        } catch (IllegalStateException e) {
            throw new InsufficientBalanceException(e.getMessage());
        }

        // Créer la transaction
        Transaction transaction = Transaction.builder()
                .type(TypeTransaction.RETRAIT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription() : "Retrait d'espèces")
                .compteSource(compte)
                .soldePrecedent(soldePrecedent)
                .nouveauSolde(compte.getSolde())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Retrait effectué avec succès. Transaction ID={}", savedTransaction.getId());

        return mapToDTO(savedTransaction);
    }

    public TransactionDTO effectuerVirement(VirementRequest request) {
        log.info("Virement de {} du compte ID={} vers le compte ID={}",
                request.getMontant(), request.getCompteSourceId(), request.getCompteDestinationId());

        // Valider que les comptes sont différents
        if (request.getCompteSourceId().equals(request.getCompteDestinationId())) {
            throw new InvalidOperationException("Impossible de faire un virement vers le même compte");
        }

        Compte compteSource = compteRepository.findById(request.getCompteSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source", "id", request.getCompteSourceId()));

        Compte compteDestination = compteRepository.findById(request.getCompteDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destination", "id",
                        request.getCompteDestinationId()));

        BigDecimal soldePrecedentSource = compteSource.getSolde();

        // Effectuer le virement (débiter source, créditer destination)
        try {
            compteSource.debiter(request.getMontant());
            compteDestination.crediter(request.getMontant());

            compteRepository.save(compteSource);
            compteRepository.save(compteDestination);
        } catch (IllegalStateException e) {
            throw new InsufficientBalanceException(e.getMessage());
        }

        // Créer la transaction
        Transaction transaction = Transaction.builder()
                .type(TypeTransaction.VIREMENT)
                .montant(request.getMontant())
                .description(request.getDescription() != null ? request.getDescription()
                        : String.format("Virement vers %s", compteDestination.getNumeroCompte()))
                .compteSource(compteSource)
                .compteDestination(compteDestination)
                .soldePrecedent(soldePrecedentSource)
                .nouveauSolde(compteSource.getSolde())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        log.info("Virement effectué avec succès. Transaction ID={}", savedTransaction.getId());

        return mapToDTO(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> obtenirTransactionsParCompte(Long compteId) {
        log.info("Récupération des transactions pour le compte ID={}", compteId);

        if (!compteRepository.existsById(compteId)) {
            throw new ResourceNotFoundException("Compte", "id", compteId);
        }

        return transactionRepository.findByCompteId(compteId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> obtenirTransactionsParPeriode(
            Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        log.info("Récupération des transactions pour le compte ID={} entre {} et {}",
                compteId, dateDebut, dateFin);

        if (!compteRepository.existsById(compteId)) {
            throw new ResourceNotFoundException("Compte", "id", compteId);
        }

        if (dateDebut.isAfter(dateFin)) {
            throw new InvalidOperationException("La date de début doit être antérieure à la date de fin");
        }

        return transactionRepository.findByCompteIdAndDateBetween(compteId, dateDebut, dateFin).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Méthode de mapping
    private TransactionDTO mapToDTO(Transaction transaction) {
        TransactionDTO.TransactionDTOBuilder builder = TransactionDTO.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .montant(transaction.getMontant())
                .description(transaction.getDescription())
                .dateTransaction(transaction.getDateTransaction())
                .soldePrecedent(transaction.getSoldePrecedent())
                .nouveauSolde(transaction.getNouveauSolde());

        if (transaction.getCompteSource() != null) {
            builder.compteSourceId(transaction.getCompteSource().getId())
                    .compteSourceNumero(transaction.getCompteSource().getNumeroCompte());
        }

        if (transaction.getCompteDestination() != null) {
            builder.compteDestinationId(transaction.getCompteDestination().getId())
                    .compteDestinationNumero(transaction.getCompteDestination().getNumeroCompte());
        }

        return builder.build();
    }
}
