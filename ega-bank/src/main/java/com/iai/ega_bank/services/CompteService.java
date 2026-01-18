package com.iai.ega_bank.services;

import com.iai.ega_bank.dto.CompteDto;
import com.iai.ega_bank.entities.CompteBancaire;
import com.iai.ega_bank.entities.CompteCourant;
import com.iai.ega_bank.entities.CompteEpargne;

import java.util.List;

public interface CompteService {
    void createAccount(CompteDto compteDto);
    List<CompteEpargne> findComptesEpargne();
    List<CompteCourant> findComptesCourant();

    CompteBancaire finfOne(String numCompte);
    CompteBancaire findOne(String numCompte);
    boolean activateCompte(String numCompte);
    boolean suspendCompte(String numCompte);
}
