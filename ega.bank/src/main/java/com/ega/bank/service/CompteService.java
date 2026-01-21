package com.ega.bank.service;

import com.ega.bank.dto.CompteDTO;
import com.ega.bank.entity.*;
import com.ega.bank.exception.InsufficientBalanceException;
import com.ega.bank.exception.InvalidTransactionException;
import com.ega.bank.exception.ResourceNotFoundException;
import com.ega.bank.repository.ClientRepository;
import com.ega.bank.repository.CompteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;
    private final IbanGeneratorService ibanGeneratorService;
    private final TransactionService transactionService;

    /**
     * Crée un nouveau compte pour un client
     */
    public CompteDTO createCompte(Long clientId, TypeCompte typeCompte, BigDecimal decouvertAutorise,
            Double tauxInteret) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé avec l'ID: " + clientId));

        // Génération d'un numéro IBAN unique
        String numeroCompte;
        try {
            do {
                numeroCompte = ibanGeneratorService.generateIban(client.getNationalite());
            } while (compteRepository.existsByNumeroCompte(numeroCompte));
        } catch (Exception e) {
            do {
                numeroCompte = ibanGeneratorService.generateIban();
            } while (compteRepository.existsByNumeroCompte(numeroCompte));
        }

        Compte compte;

        if (typeCompte == TypeCompte.COMPTE_COURANT) {
            CompteCourant compteCourant = new CompteCourant();
            compteCourant.setDecouvertAutorise(decouvertAutorise != null ? decouvertAutorise : BigDecimal.ZERO);
            compte = compteCourant;
        } else {
            CompteEpargne compteEpargne = new CompteEpargne();
            compteEpargne.setTauxInteret(tauxInteret != null ? tauxInteret : 0.0);
            compte = compteEpargne;
        }

        compte.setNumeroCompte(numeroCompte);
        compte.setProprietaire(client);
        compte.setSolde(BigDecimal.ZERO);
        compte.setActif(true);

        Compte savedCompte = compteRepository.save(compte);
        return convertToDTO(savedCompte);
    }

    /**
     * Récupère un compte par son ID
     */
    public CompteDTO getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        return convertToDTO(compte);
    }

    /**
     * Récupère un compte par son numéro IBAN
     */
    public CompteDTO getCompteByNumero(String numeroCompte) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec le numéro: " + numeroCompte));
        return convertToDTO(compte);
    }

    /**
     * Récupère tous les comptes
     */
    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère tous les comptes d'un client
     */
    public List<CompteDTO> getComptesByClientId(Long clientId) {
        return compteRepository.findByProprietaireId(clientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Effectue un versement sur un compte
     */
    public CompteDTO versement(Long compteId, BigDecimal montant, String description) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Le montant doit être supérieur à 0");
        }

        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + compteId));

        if (!compte.getActif()) {
            throw new InvalidTransactionException("Le compte est désactivé");
        }

        compte.verser(montant);
        Compte savedCompte = compteRepository.save(compte);

        // Enregistrer la transaction
        transactionService.createTransaction(
                compte,
                TypeTransaction.VERSEMENT,
                montant,
                null,
                description,
                compte.getSolde());

        return convertToDTO(savedCompte);
    }

    /**
     * Effectue un retrait sur un compte
     */
    public CompteDTO retrait(Long compteId, BigDecimal montant, String description) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Le montant doit être supérieur à 0");
        }

        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + compteId));

        if (!compte.getActif()) {
            throw new InvalidTransactionException("Le compte est désactivé");
        }

        try {
            compte.retirer(montant);
        } catch (IllegalArgumentException e) {
            throw new InsufficientBalanceException("Solde insuffisant pour effectuer ce retrait");
        }

        Compte savedCompte = compteRepository.save(compte);

        // Enregistrer la transaction
        transactionService.createTransaction(
                compte,
                TypeTransaction.RETRAIT,
                montant,
                null,
                description,
                compte.getSolde());

        return convertToDTO(savedCompte);
    }

    /**
     * Effectue un virement d'un compte à un autre
     */
    public CompteDTO virement(Long compteSourceId, String compteBeneficiaire, BigDecimal montant, String description) {
        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionException("Le montant doit être supérieur à 0");
        }

        // Compte source
        Compte compteSource = compteRepository.findById(compteSourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé"));

        // Compte bénéficiaire
        Compte compteDest = compteRepository.findByNumeroCompte(compteBeneficiaire)
                .orElseThrow(() -> new ResourceNotFoundException("Compte bénéficiaire non trouvé"));

        if (!compteSource.getActif() || !compteDest.getActif()) {
            throw new InvalidTransactionException("Un des comptes est désactivé");
        }

        // Effectuer le débit
        try {
            compteSource.retirer(montant);
        } catch (IllegalArgumentException e) {
            throw new InsufficientBalanceException("Solde insuffisant pour effectuer ce virement");
        }

        // Effectuer le crédit
        compteDest.verser(montant);

        compteRepository.save(compteSource);
        compteRepository.save(compteDest);

        // Enregistrer les transactions
        transactionService.createTransaction(
                compteSource,
                TypeTransaction.VIREMENT,
                montant,
                compteBeneficiaire,
                description,
                compteSource.getSolde());

        transactionService.createTransaction(
                compteDest,
                TypeTransaction.VERSEMENT,
                montant,
                compteSource.getNumeroCompte(),
                "Virement reçu: " + description,
                compteDest.getSolde());

        return convertToDTO(compteSource);
    }

    /**
     * Désactive un compte
     */
    public void desactiverCompte(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + id));
        compte.setActif(false);
        compteRepository.save(compte);
    }

    /**
     * Convertit une entité Compte en DTO
     */
    private CompteDTO convertToDTO(Compte compte) {
        CompteDTO.CompteDTOBuilder builder = CompteDTO.builder()
                .id(compte.getId())
                .numeroCompte(compte.getNumeroCompte())
                .typeCompte(compte.getTypeCompte())
                .solde(compte.getSolde())
                .dateCreation(compte.getDateCreation())
                .clientId(compte.getProprietaire().getId())
                .nomProprietaire(compte.getProprietaire().getPrenom() + " " + compte.getProprietaire().getNom())
                .actif(compte.getActif());

        if (compte instanceof CompteCourant) {
            builder.decouvertAutorise(((CompteCourant) compte).getDecouvertAutorise());
        } else if (compte instanceof CompteEpargne) {
            builder.tauxInteret(((CompteEpargne) compte).getTauxInteret());
        }

        return builder.build();
    }
}