package com.egabank.Backend.service.implementation;

import com.egabank.Backend.dto.OperationClientDTO;
import com.egabank.Backend.dto.VirementClientDTO;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.CompteCourant;
import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.entity.enums.TypeTransaction;
import com.egabank.Backend.exception.RessourceIntrouvableException;
import com.egabank.Backend.repository.CompteRepository;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.CompteClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class CompteClientServiceImpl implements CompteClientService {
    
    private final CompteRepository depotCompte;
    private final TransactionRepository depotTransaction;

    public CompteClientServiceImpl(CompteRepository depotCompte, TransactionRepository depotTransaction) {
        this.depotCompte = depotCompte;
        this.depotTransaction = depotTransaction;
    }

    @Override
    public List<Compte> listerMesComptes(String courrielClient) {
        return depotCompte.findByProprietaireCourriel(courrielClient);
    }

    @Override
    public Compte obtenirCompte(Long id, String courrielClient) {
        return depotCompte.findByIdAndProprietaireCourriel(id, courrielClient)
                .orElseThrow(() -> new RessourceIntrouvableException("Compte introuvable ou non autorisé"));
    }

    @Override
    public void effectuerDepot(OperationClientDTO dto, String courrielClient) {
        Compte compte = obtenirCompte(dto.compteId(), courrielClient);
        
        if (dto.montant() <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        compte.setSolde(compte.getSolde() + dto.montant());
        depotCompte.save(compte);

        Transaction transaction = new Transaction();
        transaction.setMontant(dto.montant());
        transaction.setTypeTransaction(TypeTransaction.DEPOT);
        transaction.setLibelle(dto.description() != null ? dto.description() : "Dépôt");
        transaction.setCompteSource(compte);
        depotTransaction.save(transaction);
    }

    @Override
    public void effectuerRetrait(OperationClientDTO dto, String courrielClient) {
        Compte compte = obtenirCompte(dto.compteId(), courrielClient);
        
        if (dto.montant() <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        double nouveauSolde = compte.getSolde() - dto.montant();
        
        // Vérifier le découvert autorisé pour les comptes courants
        if (compte instanceof CompteCourant compteCourant) {
            if (nouveauSolde < -compteCourant.getDecouvertAutorise()) {
                throw new IllegalArgumentException("Découvert autorisé dépassé");
            }
        } else {
            // Pour les comptes épargne, pas de découvert
            if (nouveauSolde < 0) {
                throw new IllegalArgumentException("Solde insuffisant");
            }
        }

        compte.setSolde(nouveauSolde);
        depotCompte.save(compte);

        Transaction transaction = new Transaction();
        transaction.setMontant(dto.montant());
        transaction.setTypeTransaction(TypeTransaction.RETRAIT);
        transaction.setLibelle(dto.description() != null ? dto.description() : "Retrait");
        transaction.setCompteSource(compte);
        depotTransaction.save(transaction);
    }

    @Override
    public void effectuerVirement(VirementClientDTO dto, String courrielClient) {
        Compte compteSource = obtenirCompte(dto.compteSourceId(), courrielClient);
        
        if (dto.montant() <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }

        // Trouver le compte de destination
        Compte compteDestination;
        if (dto.compteDestinationId() != null) {
            // Virement interne (entre comptes du même client)
            compteDestination = obtenirCompte(dto.compteDestinationId(), courrielClient);
        } else if (dto.numeroCompteDestination() != null) {
            // Virement externe (vers un autre compte)
            compteDestination = depotCompte.findByNumeroCompte(dto.numeroCompteDestination())
                    .orElseThrow(() -> new RessourceIntrouvableException("Compte de destination introuvable"));
        } else {
            throw new IllegalArgumentException("Compte de destination non spécifié");
        }

        if (compteSource.getId().equals(compteDestination.getId())) {
            throw new IllegalArgumentException("Impossible de faire un virement vers le même compte");
        }

        double nouveauSoldeSource = compteSource.getSolde() - dto.montant();
        
        // Vérifier le découvert autorisé pour les comptes courants
        if (compteSource instanceof CompteCourant compteCourant) {
            if (nouveauSoldeSource < -compteCourant.getDecouvertAutorise()) {
                throw new IllegalArgumentException("Découvert autorisé dépassé");
            }
        } else {
            // Pour les comptes épargne, pas de découvert
            if (nouveauSoldeSource < 0) {
                throw new IllegalArgumentException("Solde insuffisant");
            }
        }

        // Effectuer le virement
        compteSource.setSolde(nouveauSoldeSource);
        compteDestination.setSolde(compteDestination.getSolde() + dto.montant());
        
        depotCompte.save(compteSource);
        depotCompte.save(compteDestination);

        // Créer la transaction de virement
        String libelle = dto.description() != null ? dto.description() : "Virement";
        
        Transaction transaction = new Transaction();
        transaction.setMontant(dto.montant());
        transaction.setTypeTransaction(TypeTransaction.VIREMENT);
        transaction.setLibelle(libelle);
        transaction.setCompteSource(compteSource);
        transaction.setCompteDestination(compteDestination);
        depotTransaction.save(transaction);
    }
}