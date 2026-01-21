package com.ega.banque.service;

import com.ega.banque.entity.Compte;
import com.ega.banque.entity.Client;
import com.ega.banque.entity.TypeCompte;
import com.ega.banque.repository.CompteRepository;
import com.ega.banque.repository.ClientRepository;
import org.iban4j.Iban;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional
public class CompteService {

    private final CompteRepository compteRepository;
    private final ClientRepository clientRepository;

    public CompteService(CompteRepository compteRepository,
            ClientRepository clientRepository) {
        this.compteRepository = compteRepository;
        this.clientRepository = clientRepository;
    }

    public Compte creerCompte(Long clientId, TypeCompte typeCompte) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        // Générer un numéro IBAN unique
        String numeroCompte;
        do {
            Iban iban = Iban.random();
            numeroCompte = iban.toString();
        } while (compteRepository.findByNumeroCompte(numeroCompte) != null);

        Compte compte = new Compte();
        compte.setNumeroCompte(numeroCompte);
        compte.setTypeCompte(typeCompte);
        compte.setClient(client);
        compte.setSolde(BigDecimal.ZERO);

        return compteRepository.save(compte);
    }

    public Compte findByNumeroCompte(String numeroCompte) {
        return compteRepository.findByNumeroCompte(numeroCompte);
    }

    public Compte findById(Long id) {
        return compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
    }
}
