package com.ega.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ega.dto.OperationDTO;
import com.ega.dto.TransactionDTO;
import com.ega.dto.VirementDTO;
import com.ega.exception.BusinessException;
import com.ega.exception.InsufficientBalanceException;
import com.ega.exception.ResourceNotFoundException;
import com.ega.exception.UnauthorizedException;
import com.ega.mapper.TransactionMapper;
import com.ega.model.Compte;
import com.ega.model.Role;
import com.ega.model.Transaction;
import com.ega.model.TypeTransaction;
import com.ega.model.User;
import com.ega.repository.CompteRepository;
import com.ega.repository.TransactionRepository;
import com.ega.util.SecurityUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;
    private final TransactionMapper transactionMapper;
    private final SecurityUtil securityUtil;

    public List<TransactionDTO> getAllTransactions() {
        User currentUser = securityUtil.getCurrentUser();

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            // Admin voit toutes les transactions
            return transactionRepository.findAll().stream()
                    .map(transactionMapper::toDTO)
                    .collect(Collectors.toList());
        }

        // Utilisateur standard : seulement ses transactions
        if (currentUser.getClient() == null) return List.of();

        return transactionRepository.findByCompteClientId(currentUser.getClient().getId()).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction non trouvée avec l'ID: " + id));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null ||
                !transaction.getCompte().getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à cette transaction");
            }
        }

        return transactionMapper.toDTO(transaction);
    }

    public List<TransactionDTO> getTransactionsByCompteId(Long compteId) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à ce compte");
            }
        }

        return transactionRepository.findByCompteIdOrderByDateTransactionDesc(compteId).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByCompteIdAndPeriod(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à ce compte");
            }
        }

        return transactionRepository.findByCompteIdAndDateTransactionBetween(compteId, dateDebut, dateFin).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO faireDepot(OperationDTO operationDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(operationDTO.getCompteId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez opérer que sur vos propres comptes");
            }
        }

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.DEPOT);
        transaction.setMontant(operationDTO.getMontant());
        transaction.setCompte(compte);
        transaction.setDescription(operationDTO.getDescription() != null ? operationDTO.getDescription() : "Dépôt");

        compte.setSolde(compte.getSolde().add(operationDTO.getMontant()));

        Transaction savedTransaction = transactionRepository.save(transaction);
        compteRepository.save(compte);

        return transactionMapper.toDTO(savedTransaction);
    }

    public TransactionDTO faireRetrait(OperationDTO operationDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(operationDTO.getCompteId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez opérer que sur vos propres comptes");
            }
        }

        if (compte.getSolde().compareTo(operationDTO.getMontant()) < 0) {
            throw new InsufficientBalanceException("Solde insuffisant");
        }

        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.RETRAIT);
        transaction.setMontant(operationDTO.getMontant());
        transaction.setCompte(compte);
        transaction.setDescription(operationDTO.getDescription() != null ? operationDTO.getDescription() : "Retrait");

        compte.setSolde(compte.getSolde().subtract(operationDTO.getMontant()));

        Transaction savedTransaction = transactionRepository.save(transaction);
        compteRepository.save(compte);

        return transactionMapper.toDTO(savedTransaction);
    }

    public TransactionDTO faireVirement(VirementDTO virementDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compteSource = compteRepository.findById(virementDTO.getCompteSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé"));

        Compte compteDestination = compteRepository.findById(virementDTO.getCompteDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destination non trouvé"));

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            if (currentUser.getClient() == null || !compteSource.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez effectuer des virements que depuis vos propres comptes");
            }
        }

        if (compteSource.getId().equals(compteDestination.getId())) {
            throw new BusinessException("Les comptes source et destination doivent être différents");
        }

        if (compteSource.getSolde().compareTo(virementDTO.getMontant()) < 0) {
            throw new InsufficientBalanceException("Solde insuffisant");
        }

        // Transaction sortante
        Transaction transactionSortante = new Transaction();
        transactionSortante.setTypeTransaction(TypeTransaction.VIREMENT_SORTANT);
        transactionSortante.setMontant(virementDTO.getMontant());
        transactionSortante.setCompte(compteSource);
        transactionSortante.setCompteDestination(compteDestination);
        transactionSortante.setDescription(virementDTO.getDescription() != null ? virementDTO.getDescription() : "Virement vers " + compteDestination.getNumeroCompte());

        // Transaction entrante
        Transaction transactionEntrante = new Transaction();
        transactionEntrante.setTypeTransaction(TypeTransaction.VIREMENT_ENTRANT);
        transactionEntrante.setMontant(virementDTO.getMontant());
        transactionEntrante.setCompte(compteDestination);
        transactionEntrante.setCompteDestination(compteSource);
        transactionEntrante.setDescription(virementDTO.getDescription() != null ? virementDTO.getDescription() : "Virement depuis " + compteSource.getNumeroCompte());

        compteSource.setSolde(compteSource.getSolde().subtract(virementDTO.getMontant()));
        compteDestination.setSolde(compteDestination.getSolde().add(virementDTO.getMontant()));

        transactionRepository.save(transactionSortante);
        Transaction savedTransactionEntrante = transactionRepository.save(transactionEntrante);
        compteRepository.save(compteSource);
        compteRepository.save(compteDestination);

        return transactionMapper.toDTO(savedTransactionEntrante);
    }
}
