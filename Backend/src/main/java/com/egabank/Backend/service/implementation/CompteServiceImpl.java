package com.egabank.Backend.service.implementation;

import com.egabank.Backend.dto.CompteCourantCreationDTO;
import com.egabank.Backend.dto.CompteCourantModificationDTO;
import com.egabank.Backend.dto.CompteEpargneCreationDTO;
import com.egabank.Backend.dto.CompteEpargneModificationDTO;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.CompteCourant;
import com.egabank.Backend.entity.CompteEpargne;
import com.egabank.Backend.repository.CompteRepository;
import com.egabank.Backend.service.CompteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CompteServiceImpl implements CompteService {

    private final CompteRepository depotCompte;

    public CompteServiceImpl(CompteRepository depotCompte) {
        this.depotCompte = depotCompte;
    }

    @Override
    public CompteCourant creerCompteCourant(CompteCourantCreationDTO dto) {
        if (depotCompte.findByNumeroCompte(dto.numeroCompte()).isPresent()) {
            throw new IllegalArgumentException("Ce numéro de compte existe déjà");
        }
        CompteCourant compte = new CompteCourant();
        compte.setNumeroCompte(dto.numeroCompte());
        compte.setSolde(dto.soldeInitial());
        compte.setDecouvertAutorise(dto.decouvertAutorise());
        return depotCompte.save(compte);
    }

    @Override
    public CompteEpargne creerCompteEpargne(CompteEpargneCreationDTO dto) {
        if (depotCompte.findByNumeroCompte(dto.numeroCompte()).isPresent()) {
            throw new IllegalArgumentException("Ce numéro de compte existe déjà");
        }
        CompteEpargne compte = new CompteEpargne();
        compte.setNumeroCompte(dto.numeroCompte());
        compte.setSolde(dto.soldeInitial());
        compte.setTauxInteret(dto.tauxInteret());
        return depotCompte.save(compte);
    }

    @Override
    @Transactional(readOnly = true)
    public Compte consulter(String numeroCompte) {
        return depotCompte.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new IllegalArgumentException("Compte non trouvé: " + numeroCompte));
    }

    @Override
    public void effectuerDepot(String numeroCompte, double montant, String libelle) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        Compte compte = consulter(numeroCompte);
        compte.setSolde(compte.getSolde() + montant);
        depotCompte.save(compte);
    }

    @Override
    public void effectuerRetrait(String numeroCompte, double montant, String libelle) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        Compte compte = consulter(numeroCompte);

        if (compte instanceof CompteCourant) {
            CompteCourant compteCourant = (CompteCourant) compte;
            double soldeMinimal = -compteCourant.getDecouvertAutorise();
            if (compte.getSolde() - montant < soldeMinimal) {
                throw new IllegalArgumentException("Solde insuffisant (découvert dépassé)");
            }
        } else {
            if (compte.getSolde() < montant) {
                throw new IllegalArgumentException("Solde insuffisant");
            }
        }
        compte.setSolde(compte.getSolde() - montant);
        depotCompte.save(compte);
    }

    @Override
    public void effectuerVirement(String numeroCompteSource, String numeroCompteDestination, double montant, String libelle) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif");
        }
        if (numeroCompteSource.equals(numeroCompteDestination)) {
            throw new IllegalArgumentException("Les comptes source et destination doivent être différents");
        }
        effectuerRetrait(numeroCompteSource, montant, libelle);
        effectuerDepot(numeroCompteDestination, montant, libelle);
    }

    @Override
    public CompteCourant modifierCompteCourant(String numeroCompte, CompteCourantModificationDTO dto) {
        Compte compte = consulter(numeroCompte);
        if (!(compte instanceof CompteCourant)) {
            throw new IllegalArgumentException("Ce compte n'est pas un compte courant");
        }
        CompteCourant compteCourant = (CompteCourant) compte;
        compteCourant.setDecouvertAutorise(dto.decouvertAutorise());
        return depotCompte.save(compteCourant);
    }

    @Override
    public CompteEpargne modifierCompteEpargne(String numeroCompte, CompteEpargneModificationDTO dto) {
        Compte compte = consulter(numeroCompte);
        if (!(compte instanceof CompteEpargne)) {
            throw new IllegalArgumentException("Ce compte n'est pas un compte épargne");
        }
        CompteEpargne compteEpargne = (CompteEpargne) compte;
        compteEpargne.setTauxInteret(dto.tauxInteret());
        return depotCompte.save(compteEpargne);
    }

    @Override
    public void supprimer(String numeroCompte) {
        Compte compte = consulter(numeroCompte);
        if (compte.getSolde() != 0) {
            throw new IllegalArgumentException("Impossible de supprimer un compte avec un solde non nul");
        }
        depotCompte.delete(compte);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Compte> lister() {
        return depotCompte.findAll();
    }
}