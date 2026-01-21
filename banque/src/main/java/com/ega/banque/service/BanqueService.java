package com.ega.banque.service;

import com.ega.banque.model.Compte;
import com.ega.banque.model.Transaction;
import com.ega.banque.Repository.CompteRepository;
import com.ega.banque.Repository.OperationRepository;
import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional 
public class BanqueService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private OperationRepository operationRepository;

    public Compte ouvrirCompte(Compte compte) {
        // 1. Génération de l'IBAN
        String iban = Iban.random(CountryCode.FR).toFormattedString().replace(" ", "");
        compte.setNumeroCompte(iban);
        compte.setDateCreation(LocalDate.now());
        
        // Initialisation solde du compte
        if (compte.getSolde() == null) {
            compte.setSolde(0.0);
        }

        // 2. SYNCHRONISATION AVEC LE CLIENT 
        if (compte.getProprietaire() != null) {
            // On écrit les infos sur la fiche du client pour que la liste Angular soit remplie
            compte.getProprietaire().setNumeroCompte(iban); 
            compte.getProprietaire().setType(compte.getTypeCompte());
            compte.getProprietaire().setSolde(compte.getSolde());
            compte.getProprietaire().setStatut("ACTIF");
        }
        
        return compteRepository.save(compte);
    }

    public Compte verser(String numeroCompte, double montant) {
    Compte cp = compteRepository.findById(numeroCompte)
        .orElseThrow(() -> new RuntimeException("Compte introuvable"));
    
    // 1. On met à jour le solde du compte
    cp.setSolde(cp.getSolde() + montant);
    
    // 2. IMPORTANT : On met à jour aussi le solde dans l'objet Client
    if (cp.getProprietaire() != null) {
        cp.getProprietaire().setSolde(cp.getSolde());
        // On peut aussi mettre à jour le statut si besoin
        cp.getProprietaire().setStatut("ACTIF"); 
    }
    
    operationRepository.save(new Transaction(null, cp.getProprietaire().getId(), "VERSEMENT", montant, LocalDateTime.now().toString()));
    
    return compteRepository.save(cp);
}

    public Compte retirer(String numeroCompte, double montant) {
        Compte cp = compteRepository.findById(numeroCompte)
            .orElseThrow(() -> new RuntimeException("Compte introuvable : " + numeroCompte));
            
        if (cp.getSolde() < montant) {
            throw new RuntimeException("Solde insuffisant !");
        }
        
        cp.setSolde(cp.getSolde() - montant);
        
        Transaction transac = new Transaction();
        if (cp.getProprietaire() != null) {
            transac.setClientId(cp.getProprietaire().getId());
        }
        transac.setType("RETRAIT");
        transac.setMontant(montant);
        transac.setDate(LocalDateTime.now().toString());

        operationRepository.save(transac);
        return compteRepository.save(cp);
    }

    public List<Transaction> getHistorique(Long clientId) {
        return operationRepository.findByClientId(clientId);
    }
}