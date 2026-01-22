package com.ega.service;

import com.ega.dto.OperationDTO;
import com.ega.dto.TransactionDTO;
import com.ega.dto.VirementDTO;
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
    private final TransactionMapper transactionMapper;
    private final SecurityUtil securityUtil;

    public List<TransactionDTO> getAllTransactions() {
        User currentUser = securityUtil.getCurrentUser();
        if (currentUser.getClient() == null) {
            return List.of();
        }
        // Un utilisateur ne voit que les transactions de ses propres comptes
        return transactionRepository.findByCompteClientId(currentUser.getClient().getId()).stream()
                .map(transactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long id) {
        User currentUser = securityUtil.getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction non trouvée avec l'ID: " + id));
        
        // Les admins ont accès à toutes les transactions
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut voir que les transactions de ses propres comptes
            if (currentUser.getClient() == null || !transaction.getCompte().getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous n'avez pas accès à cette transaction");
            }
        }
        
        return transactionMapper.toDTO(transaction);
    }

    public List<TransactionDTO> getTransactionsByCompteId(Long compteId) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + compteId));
        
        // Les admins ont accès à tous les comptes
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut voir que ses propres comptes
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
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + compteId));
        
        // Les admins ont accès à tous les comptes
        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            // Un utilisateur normal ne peut voir que ses propres comptes
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
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + operationDTO.getCompteId()));

        // Vérifier que le compte appartient à l'utilisateur connecté
        if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
            throw new UnauthorizedException("Vous ne pouvez effectuer des opérations que sur vos propres comptes");
        }

        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.DEPOT);
        transaction.setMontant(operationDTO.getMontant());
        transaction.setCompte(compte);
        transaction.setDescription(operationDTO.getDescription() != null ? 
            operationDTO.getDescription() : "Dépôt");

        // Mettre à jour le solde
        compte.setSolde(compte.getSolde().add(operationDTO.getMontant()));

        Transaction savedTransaction = transactionRepository.save(transaction);
        compteRepository.save(compte);

        return transactionMapper.toDTO(savedTransaction);
    }

    public TransactionDTO faireRetrait(OperationDTO operationDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compte = compteRepository.findById(operationDTO.getCompteId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + operationDTO.getCompteId()));

        // Vérifier que le compte appartient à l'utilisateur connecté
        if (currentUser.getClient() == null || !compte.getClient().getId().equals(currentUser.getClient().getId())) {
            throw new UnauthorizedException("Vous ne pouvez effectuer des opérations que sur vos propres comptes");
        }

        // Vérifier que le solde est suffisant
        if (compte.getSolde().compareTo(operationDTO.getMontant()) < 0) {
            throw new InsufficientBalanceException(
                "Solde insuffisant. Solde actuel: " + compte.getSolde() + 
                ", Montant demandé: " + operationDTO.getMontant()
            );
        }

        // Créer la transaction
        Transaction transaction = new Transaction();
        transaction.setTypeTransaction(TypeTransaction.RETRAIT);
        transaction.setMontant(operationDTO.getMontant());
        transaction.setCompte(compte);
        transaction.setDescription(operationDTO.getDescription() != null ? 
            operationDTO.getDescription() : "Retrait");

        // Mettre à jour le solde
        compte.setSolde(compte.getSolde().subtract(operationDTO.getMontant()));

        Transaction savedTransaction = transactionRepository.save(transaction);
        compteRepository.save(compte);

        return transactionMapper.toDTO(savedTransaction);
    }

    public TransactionDTO faireVirement(VirementDTO virementDTO) {
        User currentUser = securityUtil.getCurrentUser();
        Compte compteSource = compteRepository.findById(virementDTO.getCompteSourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé avec l'ID: " + virementDTO.getCompteSourceId()));

        Compte compteDestination = compteRepository.findById(virementDTO.getCompteDestinationId())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destination non trouvé avec l'ID: " + virementDTO.getCompteDestinationId()));

        // Vérifier que le compte source appartient à l'utilisateur connecté (sauf pour les admins)
        if (!securityUtil.isAdmin()) {
            if (currentUser.getClient() == null || !compteSource.getClient().getId().equals(currentUser.getClient().getId())) {
                throw new UnauthorizedException("Vous ne pouvez effectuer des virements qu'à partir de vos propres comptes");
            }
        }

        // Vérifier que les comptes sont différents
        if (compteSource.getId().equals(compteDestination.getId())) {
            throw new com.ega.exception.BusinessException("Les comptes source et destination doivent être différents");
        }

        // Vérifier que le solde est suffisant
        if (compteSource.getSolde().compareTo(virementDTO.getMontant()) < 0) {
            throw new InsufficientBalanceException(
                "Solde insuffisant. Solde actuel: " + compteSource.getSolde() + 
                ", Montant demandé: " + virementDTO.getMontant()
            );
        }

        // Transaction sortante
        Transaction transactionSortante = new Transaction();
        transactionSortante.setTypeTransaction(TypeTransaction.VIREMENT_SORTANT);
        transactionSortante.setMontant(virementDTO.getMontant());
        transactionSortante.setCompte(compteSource);
        transactionSortante.setCompteDestination(compteDestination);
        transactionSortante.setDescription(virementDTO.getDescription() != null ? 
            virementDTO.getDescription() : "Virement vers compte " + compteDestination.getNumeroCompte());

        // Transaction entrante
        Transaction transactionEntrante = new Transaction();
        transactionEntrante.setTypeTransaction(TypeTransaction.VIREMENT_ENTRANT);
        transactionEntrante.setMontant(virementDTO.getMontant());
        transactionEntrante.setCompte(compteDestination);
        transactionEntrante.setCompteDestination(compteSource);
        transactionEntrante.setDescription(virementDTO.getDescription() != null ? 
            virementDTO.getDescription() : "Virement depuis compte " + compteSource.getNumeroCompte());

        // Mettre à jour les soldes
        compteSource.setSolde(compteSource.getSolde().subtract(virementDTO.getMontant()));
        compteDestination.setSolde(compteDestination.getSolde().add(virementDTO.getMontant()));

        // Sauvegarder les transactions
        transactionRepository.save(transactionSortante);
        Transaction savedTransactionEntrante = transactionRepository.save(transactionEntrante);
        compteRepository.save(compteSource);
        compteRepository.save(compteDestination);

        // Retourner la transaction entrante (on pourrait aussi retourner les deux)
        return transactionMapper.toDTO(savedTransactionEntrante);
    }
}

