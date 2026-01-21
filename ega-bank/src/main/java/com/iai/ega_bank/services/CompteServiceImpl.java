package com.iai.ega_bank.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.iai.ega_bank.dto.CompteDto;
import com.iai.ega_bank.entities.AccountStatus;
import com.iai.ega_bank.entities.Client;
import com.iai.ega_bank.entities.CompteBancaire;
import com.iai.ega_bank.entities.CompteCourant;
import com.iai.ega_bank.entities.CompteEpargne;
import com.iai.ega_bank.repositories.ClientRepository;
import com.iai.ega_bank.repositories.CompteBancaireRepository;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Service
public class CompteServiceImpl implements CompteService {

    private final CompteBancaireRepository compteBancaireRepository;
    private final ClientRepository clientRepository;

    public CompteServiceImpl(CompteBancaireRepository compteBancaireRepository, ClientRepository clientRepository) {
        this.compteBancaireRepository = compteBancaireRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public void createAccount(CompteDto compteDto) {

        Optional<Client> clientOpt = clientRepository.findById(compteDto.getClientId());
        if (clientOpt.isEmpty()) {
            throw new RuntimeException("Client introuvable");
        }

        Client client = clientOpt.get();

        // COMPTE COURANT
        if (compteDto.getDecouvert() > 0 && compteDto.getInterestRate() == 0) {
            CompteCourant compteCourant = new CompteCourant();
            compteCourant.setCreateAt(new Date());
            compteCourant.setBalance(compteDto.getBalance());
            compteCourant.setDecouvert(compteDto.getDecouvert());
            compteCourant.setClient(client);
            compteCourant.setStatus(AccountStatus.ACTIVATED);
            compteCourant.setNumCompte(generateAccountNumber());

            compteBancaireRepository.save(compteCourant);
        }
        // COMPTE EPARGNE
        if (compteDto.getDecouvert() == 0 && compteDto.getInterestRate() > 0) {
            CompteEpargne compteEpargne = new CompteEpargne();
            compteEpargne.setCreateAt(new Date());
            compteEpargne.setBalance(compteDto.getBalance());
            compteEpargne.setInterestRate(compteDto.getInterestRate());
            compteEpargne.setClient(client);
            compteEpargne.setStatus(AccountStatus.ACTIVATED);
            compteEpargne.setNumCompte(generateAccountNumber());

            compteBancaireRepository.save(compteEpargne);
        }
    }

    private static String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        // 4 zéros au début
        sb.append("0000");

        // 8 chiffres aléatoires
        for (int i = 0; i < 8; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    @Override
    public List<CompteEpargne> findComptesEpargne() {
        List<CompteEpargne> comptesEpargne = new ArrayList<>();

        for (CompteBancaire compte : compteBancaireRepository.findAll()) {
            if (compte instanceof CompteEpargne) {
                comptesEpargne.add((CompteEpargne) compte);
            }
        }
        return comptesEpargne;
    }

    @Override
    public List<CompteCourant> findComptesCourant() {
        List<CompteCourant> comptesCourant = new ArrayList<>();

        for (CompteBancaire compte : compteBancaireRepository.findAll()) {
            if (compte instanceof CompteCourant) {
                comptesCourant.add((CompteCourant) compte);
            }
        }
        return comptesCourant;
    }

    @Override
    public CompteBancaire findOne(String numCompte) {
        return compteBancaireRepository
                .findByNumCompte(numCompte)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }

    @Override
    public List<CompteBancaire> findAll() {
        return compteBancaireRepository.findAll();
    }

    @Override
    public boolean activateCompte(String numCompte) {
        Optional<CompteBancaire> compte = this.compteBancaireRepository.findByNumCompte(numCompte);
        if(compte.isPresent()&& compte.get().getStatus().equals(AccountStatus.SUSPENDED)){
            CompteBancaire c = compte.get();
            c.setStatus(AccountStatus.ACTIVATED);
            this.compteBancaireRepository.save(c);
            return true;
        }
        return false;
    }

    @Override
    public boolean suspendCompte(String numCompte) {
        Optional<CompteBancaire> compte = this.compteBancaireRepository.findByNumCompte(numCompte);
        if(compte.isPresent()&& compte.get().getStatus().equals(AccountStatus.ACTIVATED)){
            CompteBancaire c = compte.get();
            c.setStatus(AccountStatus.SUSPENDED);
            this.compteBancaireRepository.save(c);
            return true;
        }
        return false;
    }

}
