/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import com.egabank.Backend.dto.CompteCourantCreationDTO;
import com.egabank.Backend.dto.CompteEpargneCreationDTO;
import com.egabank.Backend.entity.Client;
import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.CompteCourant;
import com.egabank.Backend.entity.CompteEpargne;
import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.entity.enums.TypeCompte;
import com.egabank.Backend.entity.enums.TypeTransaction;
import com.egabank.Backend.exception.ExceptionMetier;
import com.egabank.Backend.exception.RessourceIntrouvableException;
import com.egabank.Backend.repository.CompteRepository;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.ClientService;
import com.egabank.Backend.service.CompteService;
import com.egabank.Backend.service.IbanService;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class CompteServiceImpl implements CompteService{
     private final CompteRepository depotCompte;
    private final TransactionRepository depotTransaction;
    private final ClientService serviceClients;
    private final IbanService serviceIban;

    public CompteServiceImpl(CompteRepository depotCompte,
                              TransactionRepository depotTransaction,
                              ClientService serviceClients,
                              IbanService serviceIban) {
        this.depotCompte = depotCompte;
        this.depotTransaction = depotTransaction;
        this.serviceClients = serviceClients;
        this.serviceIban = serviceIban;
    }

    @Override
    public CompteCourant creerCompteCourant(CompteCourantCreationDTO dto) {
        Client proprietaire = serviceClients.trouver(dto.idClient());

        CompteCourant compte = new CompteCourant();
        compte.setProprietaire(proprietaire);
        compte.setTypeCompte(TypeCompte.COURANT);
        compte.setSolde(0.0);
        compte.setDecouvertAutorise(dto.decouvertAutorise());
        compte.setNumeroCompte(genererIbanUnique());

        return (CompteCourant) depotCompte.save(compte);
    }

    @Override
    public CompteEpargne creerCompteEpargne(CompteEpargneCreationDTO dto) {
        Client proprietaire = serviceClients.trouver(dto.idClient());

        CompteEpargne compte = new CompteEpargne();
        compte.setProprietaire(proprietaire);
        compte.setTypeCompte(TypeCompte.EPARGNE);
        compte.setSolde(0.0);
        compte.setTauxInteret(dto.tauxInteret());
        compte.setNumeroCompte(genererIbanUnique());

        return (CompteEpargne) depotCompte.save(compte);
    }

    @Override
    public Compte consulter(String numeroCompte) {
        return depotCompte.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new RessourceIntrouvableException("Compte introuvable : " + numeroCompte));
    }

    @Override
    public void effectuerDepot(String numeroCompte, Double montant, String libelle) {
        crediter(numeroCompte, montant, libelle, TypeTransaction.DEPOT);
    }


    @Override
    public void effectuerRetrait(String numeroCompte, Double montant, String libelle) {
        if (montant == null || montant <= 0) throw new ExceptionMetier("Montant invalide.");

        Compte compte = consulter(numeroCompte);

        double soldeDisponible = compte.getSolde();
        if (compte instanceof CompteCourant cc) soldeDisponible += cc.getDecouvertAutorise();

        if (montant > soldeDisponible) throw new ExceptionMetier("Solde insuffisant.");

        compte.setSolde(compte.getSolde() - montant);
        depotCompte.save(compte);

        Transaction t = new Transaction();
        t.setTypeTransaction(TypeTransaction.RETRAIT);
        t.setMontant(montant);
        t.setLibelle(libelle);
        t.setCompteSource(compte);
        t.setCompteDestination(null);
        depotTransaction.save(t);
    }

    @Override
    public void effectuerVirement(String numeroCompteSource, String numeroCompteDestination, Double montant, String libelle) {
        if (numeroCompteSource.equals(numeroCompteDestination)) throw new ExceptionMetier("Comptes identiques.");
        if (montant == null || montant <= 0) throw new ExceptionMetier("Montant invalide.");

        Compte source = consulter(numeroCompteSource);
        Compte destination = consulter(numeroCompteDestination);

        double soldeDisponible = source.getSolde();
        if (source instanceof CompteCourant cc) soldeDisponible += cc.getDecouvertAutorise();
        if (montant > soldeDisponible) throw new ExceptionMetier("Solde insuffisant sur le compte source.");

        source.setSolde(source.getSolde() - montant);
        destination.setSolde(destination.getSolde() + montant);

        depotCompte.save(source);
        depotCompte.save(destination);

        Transaction t = new Transaction();
        t.setTypeTransaction(TypeTransaction.VIREMENT);
        t.setMontant(montant);
        t.setLibelle(libelle);
        t.setCompteSource(source);
        t.setCompteDestination(destination);
        depotTransaction.save(t);
    }
    
    @Override
    public List<Compte> lister() {
        return depotCompte.findAll();
    }


    private void crediter(String numeroCompte, Double montant, String libelle, TypeTransaction type) {
        if (montant == null || montant <= 0) throw new ExceptionMetier("Montant invalide.");

        Compte compte = consulter(numeroCompte);
        compte.setSolde(compte.getSolde() + montant);
        depotCompte.save(compte);

        Transaction t = new Transaction();
        t.setTypeTransaction(type);
        t.setMontant(montant);
        t.setLibelle(libelle);
        t.setCompteSource(compte);
        t.setCompteDestination(null);
        depotTransaction.save(t);
    }

    private String genererIbanUnique() {
        String iban;
        int tentatives = 0;
        do {
            if (tentatives++ > 30) throw new ExceptionMetier("Impossible de générer un IBAN unique.");
            iban = serviceIban.genererIban();
        } while (depotCompte.existsByNumeroCompte(iban));
        return iban;
    }
}
