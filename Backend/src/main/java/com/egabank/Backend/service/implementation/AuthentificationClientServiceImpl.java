package com.egabank.Backend.service.implementation;

import com.egabank.Backend.dto.ClientInscriptionDTO;
import com.egabank.Backend.dto.ClientConnexionDTO;
import com.egabank.Backend.dto.ClientAuthJetonDTO;
import com.egabank.Backend.dto.ChangementMotDePasseDTO;
import com.egabank.Backend.entity.Client;
import com.egabank.Backend.exception.RessourceIntrouvableException;
import com.egabank.Backend.repository.ClientRepository;
import com.egabank.Backend.securite.ServiceJwt;
import com.egabank.Backend.service.AuthentificationClientService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.Period;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class AuthentificationClientServiceImpl implements AuthentificationClientService {
    
    private final ClientRepository depotClient;
    private final ServiceJwt serviceJwt;
    private final BCryptPasswordEncoder encodeur;

    public AuthentificationClientServiceImpl(ClientRepository depotClient, 
                                           ServiceJwt serviceJwt, 
                                           BCryptPasswordEncoder encodeur) {
        this.depotClient = depotClient;
        this.serviceJwt = serviceJwt;
        this.encodeur = encodeur;
    }

    @Override
    public Client inscrire(ClientInscriptionDTO dto) {
        // Vérifier l'âge minimum (18 ans)
        if (Period.between(dto.dateNaissance(), LocalDate.now()).getYears() < 18) {
            throw new IllegalArgumentException("Vous devez avoir au moins 18 ans pour ouvrir un compte");
        }
        
        // Vérifier l'unicité de l'email
        if (depotClient.existsByCourriel(dto.courriel())) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email");
        }
        
        // Vérifier l'unicité du numéro de téléphone
        if (depotClient.existsByNumeroTelephone(dto.numeroTelephone())) {
            throw new IllegalArgumentException("Un compte existe déjà avec ce numéro de téléphone");
        }

        Client client = new Client();
        client.setNom(dto.nom());
        client.setPrenom(dto.prenom());
        client.setDateNaissance(dto.dateNaissance());
        client.setSexe(dto.sexe());
        client.setAdresse(dto.adresse());
        client.setNumeroTelephone(dto.numeroTelephone());
        client.setCourriel(dto.courriel());
        client.setNationalite(dto.nationalite());
        client.setMotDePasse(encodeur.encode(dto.motDePasse()));

        return depotClient.save(client);
    }

    @Override
    public ClientAuthJetonDTO connecter(ClientConnexionDTO dto) {
        Client client = depotClient.findByCourriel(dto.courriel())
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

        if (!encodeur.matches(dto.motDePasse(), client.getMotDePasse())) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        // Générer le token avec l'email comme subject et "CLIENT" comme rôle
        String jeton = serviceJwt.genererJeton(client.getCourriel(), "CLIENT");
        return new ClientAuthJetonDTO(jeton, client);
    }

    @Override
    public Client obtenirProfilClient(String courriel) {
        return depotClient.findByCourriel(courriel)
                .orElseThrow(() -> new RessourceIntrouvableException("Client introuvable"));
    }

    @Override
    public void changerMotDePasse(String courriel, ChangementMotDePasseDTO dto) {
        Client client = obtenirProfilClient(courriel);
        
        if (!encodeur.matches(dto.ancienMotDePasse(), client.getMotDePasse())) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }
        
        client.setMotDePasse(encodeur.encode(dto.nouveauMotDePasse()));
        depotClient.save(client);
    }
}