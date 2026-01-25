package com.ega.backend.service;

import com.ega.backend.model.Compte;
import com.ega.backend.model.Client;
import com.ega.backend.model.Transaction;
import com.ega.backend.repository.CompteRepository;
import com.ega.backend.repository.TransactionRepository;
import com.ega.backend.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CompteService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Compte> getAllComptes() {
        return compteRepository.findAll();
    }

    public Optional<Compte> getCompteById(String id) {
        return compteRepository.findById(id);
    }

    public Compte createCompte(Compte compte) {
        if (compte.getSolde() == null) {
            compte.setSolde(BigDecimal.ZERO);
        }
        return compteRepository.save(compte);
    }

    // ✅ Méthode mise à jour pour inclure isActive
    public Compte updateCompte(String id, Compte compteDetails) { // <--- Renommé pour plus de clarté
        Optional<Compte> existingOpt = compteRepository.findById(id);
        if (existingOpt.isEmpty()) return null;

        Compte existing = existingOpt.get();

        // Mettre à jour les champs autorisés à partir de compteDetails
        if (compteDetails.getNumeroCompte() != null) {
            existing.setNumeroCompte(compteDetails.getNumeroCompte());
        }
        // ATTENTION : Ne pas permettre la mise à jour du solde via cette méthode générique
        // Sauf si explicitement autorisé pour l'admin, mais ce n'est pas la logique standard.
        // Si tu veux l'autoriser, décommente la ligne ci-dessous.
        // existing.setSolde(compteDetails.getSolde() != null ? compteDetails.getSolde() : BigDecimal.ZERO);

        if (compteDetails.getDevise() != null) {
            existing.setDevise(compteDetails.getDevise());
        }
        if (compteDetails.getType() != null) {
            existing.setType(compteDetails.getType());
        }
        // ✅ AJOUTE CETTE PARTIE POUR METTRE À JOUR isActive
        if (compteDetails.getIsActive() != null) {
            existing.setIsActive(compteDetails.getIsActive());
        }
        // Mettre à jour d'autres champs si nécessaire
        if (compteDetails.getDescription() != null) {
            existing.setDescription(compteDetails.getDescription());
        }
        if (compteDetails.getClientId() != null) {
            // Attention : Changer le propriétaire d'un compte est une opération sensible
            // existing.setClientId(compteDetails.getClientId());
        }
        // closedAt si tu veux l'autoriser via PUT
        // if (compteDetails.getClosedAt() != null) {
        //     existing.setClosedAt(compteDetails.getClosedAt());
        // }

        return compteRepository.save(existing);
    }

    public Compte saveCompte(Compte compte) {
        if (compte.getSolde() == null) {
            compte.setSolde(BigDecimal.ZERO);
        }
        return compteRepository.save(compte);
    }

    public void deleteCompte(String id) {
        compteRepository.deleteById(id);
    }

    // ✅ Méthode depot corrigée
    public Compte depot(String compteId, BigDecimal montant) {
        Optional<Compte> compteOpt = compteRepository.findById(compteId);
        if (compteOpt.isEmpty()) return null;

        Compte compte = compteOpt.get();

        // ✅ VÉRIFICATION : Le compte est-il actif ?
        if (!Boolean.TRUE.equals(compte.getIsActive())) {
            throw new RuntimeException("Impossible d'effectuer un dépôt sur un compte désactivé.");
        }

        if (compte.getSolde() == null) {
            compte.setSolde(BigDecimal.ZERO);
        }
        compte.setSolde(compte.getSolde().add(montant));
        saveCompte(compte);

        Transaction transaction = new Transaction();
        transaction.setCompteSourceId(compteId);
        transaction.setType("depot");
        transaction.setMontant(montant);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Dépôt effectué");
        transactionRepository.save(transaction);

        return compte;
    }

    public Compte versement(String compteId, BigDecimal montant) {
        Optional<Compte> compteOpt = compteRepository.findById(compteId);
        if (compteOpt.isEmpty()) return null;

        Compte compte = compteOpt.get();
        if (compte.getSolde() == null) {
            compte.setSolde(BigDecimal.ZERO);
        }
        compte.setSolde(compte.getSolde().add(montant));
        saveCompte(compte);

        Transaction transaction = new Transaction();
        transaction.setCompteSourceId(compteId);
        transaction.setType("versement");
        transaction.setMontant(montant);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Versement effectué");
        transactionRepository.save(transaction);

        return compte;
    }

    // ✅ Méthode retrait corrigée
   public Compte retrait(String compteId, BigDecimal montant) {
    Optional<Compte> compteOpt = compteRepository.findById(compteId);
    if (compteOpt.isEmpty()) return null;

    Compte compte = compteOpt.get();

    // ✅ VÉRIFICATION : Le compte est-il actif ?
    if (!Boolean.TRUE.equals(compte.getIsActive())) {
        throw new RuntimeException("Impossible d'effectuer un retrait sur un compte désactivé.");
    }

    if (compte.getSolde() == null) {
        compte.setSolde(BigDecimal.ZERO);
    }
    
    if (compte.getSolde().compareTo(montant) >= 0) { // ✅ Solde suffisant
        compte.setSolde(compte.getSolde().subtract(montant));
        saveCompte(compte);

        Transaction transaction = new Transaction();
        transaction.setCompteSourceId(compteId);
        transaction.setType("retrait");
        transaction.setMontant(montant);
        transaction.setDate(LocalDateTime.now());
        transaction.setDescription("Retrait effectué");
        transactionRepository.save(transaction);

        return compte; // ✅ Retourne le compte mis à jour
    }
    
    throw new RuntimeException("Solde insuffisant."); // Levée d'exception pour solde insuffisant
}

    // ✅ Méthode virement corrigée (incluant la vérification du virement vers le même compte)
    public boolean virement(String compteSourceId, String compteDestId, BigDecimal montant) {
        // ✅ VÉRIFICATION : Empêcher le virement vers le même compte
        if (compteSourceId.equals(compteDestId)) {
            throw new RuntimeException("Impossible de faire un virement vers le même compte.");
        }

        Optional<Compte> sourceOpt = compteRepository.findById(compteSourceId);
        Optional<Compte> destOpt = compteRepository.findById(compteDestId);

        if (sourceOpt.isEmpty() || destOpt.isEmpty()) {
            return false;
        }

        Compte source = sourceOpt.get();
        Compte dest = destOpt.get();

        // ✅ VÉRIFICATIONS : Les comptes sont-ils actifs ?
        if (!Boolean.TRUE.equals(source.getIsActive())) {
            throw new RuntimeException("Impossible d'effectuer un virement depuis un compte désactivé.");
        }
        if (!Boolean.TRUE.equals(dest.getIsActive())) {
            throw new RuntimeException("Impossible d'effectuer un virement vers un compte désactivé.");
        }

        if (source.getSolde() == null) source.setSolde(BigDecimal.ZERO);
        if (dest.getSolde() == null) dest.setSolde(BigDecimal.ZERO);

        if (source.getSolde().compareTo(montant) >= 0) { // ✅ Solde suffisant
            source.setSolde(source.getSolde().subtract(montant));
            saveCompte(source);

            dest.setSolde(dest.getSolde().add(montant));
            saveCompte(dest);

            Transaction transactionSortante = new Transaction();
            transactionSortante.setCompteSourceId(compteSourceId);
            transactionSortante.setCompteDestId(compteDestId);
            transactionSortante.setType("virement_sortant");
            transactionSortante.setMontant(montant);
            transactionSortante.setDate(LocalDateTime.now());
            transactionSortante.setDescription("Virement vers " + compteDestId);
            transactionRepository.save(transactionSortante);

            Transaction transactionEntrante = new Transaction();
            transactionEntrante.setCompteSourceId(compteSourceId);
            transactionEntrante.setCompteDestId(compteDestId);
            transactionEntrante.setType("virement_entrant");
            transactionEntrante.setMontant(montant);
            transactionEntrante.setDate(LocalDateTime.now());
            transactionEntrante.setDescription("Virement reçu de " + compteSourceId);
            transactionRepository.save(transactionEntrante);

            return true;
        }
        throw new RuntimeException("Solde insuffisant sur le compte source.");
    }

    public List<Compte> getComptesByClientId(String clientId) {
        return compteRepository.findByClientId(clientId);
    }

    // ✅ Méthode corrigée : Récupérer les comptes par email
    public List<Compte> getComptesByEmail(String email) {
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return List.of();
        }

        Client client = clientOpt.get();
        return compteRepository.findByClientId(client.getId());
    }

    // ✅ Nouvelle méthode : Vérifier si un utilisateur est propriétaire d'un compte
    public boolean isCompteOwner(String email, String compteId) {
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isPresent()) {
            Client client = clientOpt.get();
            Optional<Compte> compteOpt = compteRepository.findById(compteId);
            if (compteOpt.isPresent()) {
                return compteOpt.get().getClientId().equals(client.getId());
            }
        }
        return false;
    }
}