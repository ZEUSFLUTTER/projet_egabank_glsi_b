package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.CompteRequestClient;
import com.ega.ega_bank.dto.CompteRequestAdmin;
import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.Compte;
import com.ega.ega_bank.exception.NotFoundException;
import com.ega.ega_bank.repository.ClientRepository;
import com.ega.ega_bank.repository.CompteRepository;
import com.ega.ega_bank.util.IbanUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CompteService {

    private final CompteRepository compteRepo;
    private final ClientRepository clientRepo;

    public CompteService(CompteRepository compteRepo, ClientRepository clientRepo) {
        this.compteRepo = compteRepo;
        this.clientRepo = clientRepo;
    }

    // 🔹 Création de compte par le client connecté
    public Compte createForConnectedClient(CompteRequestClient req, String email) {
        Client client = clientRepo.findByCourriel(email)
                .orElseThrow(() -> new NotFoundException("Client introuvable"));

        Compte compte = new Compte();
        String iban = IbanUtil.generateIbanFrance();
        IbanUtil.validateIban(iban);

        compte.setNumeroCompte(iban);
        compte.setType(req.getType());
        compte.setDateCreation(LocalDate.now());
        compte.setProprietaire(client);

        if (req.getSoldeInitial() != null) {
            compte.setSolde(BigDecimal.valueOf(req.getSoldeInitial()));
        }

        return compteRepo.save(compte);
    }

    // 🔹 Création de compte par l'admin
    public Compte createForAnyClient(CompteRequestAdmin req) {
        Client client = clientRepo.findById(req.getProprietaireId())
                .orElseThrow(() -> new NotFoundException("Propriétaire introuvable"));

        Compte compte = new Compte();
        String iban = IbanUtil.generateIbanFrance();
        IbanUtil.validateIban(iban);

        compte.setNumeroCompte(iban);
        compte.setType(req.getType());
        compte.setDateCreation(LocalDate.now());
        compte.setProprietaire(client);

        if (req.getSoldeInitial() != null) {
            compte.setSolde(BigDecimal.valueOf(req.getSoldeInitial()));
        }

        return compteRepo.save(compte);
    }

    // ADMIN : récupérer les comptes d’un client par son ID
    public List<Compte> listByClient(Long clientId) {
        return compteRepo.findByProprietaireId(clientId);
    }

    // CLIENT : récupérer les comptes du client connecté par son email
    public List<Compte> listByClientEmail(String email) {
        System.out.println("Recherche des comptes pour l'email: " + email);
        List<Compte> comptes = compteRepo.findByProprietaireCourrielIgnoreCase(email.trim());
        System.out.println("Comptes trouvés pour " + email + ": " + comptes.size());
        return comptes;
    }

    public Compte getByNumero(String numero) {
        return compteRepo.findByNumeroCompte(numero)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));
    }

    public void delete(Long id) {
        compteRepo.deleteById(id);
    }
}
