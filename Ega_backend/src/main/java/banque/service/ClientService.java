package banque.service;

import banque.entity.Client;
import banque.entity.Compte;
import banque.entity.Utilisateur;
import banque.enums.Role;
import banque.helpers.ClientHelpers;
import banque.repository.ClientRepository;
import banque.repository.CompteRepository;
import banque.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import banque.exception.*;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    private final CompteRepository compteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final ClientHelpers clientHelpers;

    //Créer un client
    @Transactional
    public Client createClient(Client client) {
        if (clientRepository.existsByEmailAndEstSupprimeFalse(client.getEmail())) {
            throw new BanqueException("Un client avec cet email existe déjà !");
        }
        clientHelpers.validerFormatTelephone(client.getTelephone());
        if (clientRepository.findByTelephoneAndEstSupprimeFalse(client.getTelephone()).isPresent()) {
            throw new BanqueException("Ce numéro de téléphone est déjà associé à un client.");
        }
        client.setTelephone(clientHelpers.normaliserTelephone(client.getTelephone()));
        client.setId(null);

        client.setEstSupprime(false);
        Client savedClient = clientRepository.save(client);

        String rawPassword = (client.getPassword() != null && !client.getPassword().isEmpty())
                ? client.getPassword()
                : "Ega2026";

        Utilisateur user = Utilisateur.builder()
                .username(savedClient.getEmail()) // L'email devient l'identifiant
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.CLIENT)
                .actif(true)
                .client(savedClient)
                .build();

        utilisateurRepository.save(user);
        return savedClient;
    }

    //Afficher tous les clients actifs
    public List<Client> getAllClients() {
        return clientRepository.findByEstSupprimeFalse();
    }

    // Récuperer un client par son id
    public Client getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new BanqueException("Client introuvable !"));

        if (Boolean.TRUE.equals(client.getEstSupprime())) {
            throw new BanqueException("Ce dossier client a été désactivé.");
        }
        return client;
    }

    @Transactional
    public Client updateClient(Long id, Client clientInfos) {
        Client clientExistant = getClientById(id);

        // Vérifier Email si changement
        if (!clientExistant.getEmail().equals(clientInfos.getEmail()) &&
                clientRepository.existsByEmailAndEstSupprimeFalse(clientInfos.getEmail())) {
            throw new BanqueException("Le nouvel email est déjà pris.");
        }

        // Vérifier Téléphone si changement
        if (!clientExistant.getTelephone().equals(clientInfos.getTelephone())) {
            clientHelpers.validerFormatTelephone(clientInfos.getTelephone());
        }

        // Mise à jour des champs
        clientExistant.setNom(clientInfos.getNom());
        clientExistant.setPrenom(clientInfos.getPrenom());
        clientExistant.setTelephone(clientHelpers.normaliserTelephone(clientInfos.getTelephone()));
        clientExistant.setAdresse(clientInfos.getAdresse());
        clientExistant.setEmail(clientInfos.getEmail());
        clientExistant.setDateNaiss(clientInfos.getDateNaiss());
        clientExistant.setSexe(clientInfos.getSexe());
        clientExistant.setNationalite(clientInfos.getNationalite());

        return clientRepository.save(clientExistant);
    }

    // Recherche dynamique d'un client
    public List<Client> rechercherClient(String valeur) {
        if (valeur == null || valeur.isBlank()) return getAllClients();
        if (clientHelpers.isEmail(valeur)) {
            return Collections.singletonList(rechercherParEmail(valeur));
        }
        if (clientHelpers.isTelephone(valeur)) {
            return Collections.singletonList(rechercherParTelephone(valeur));
        }
        return rechercherParNomOuPrenom(valeur);
    }

    // Suppression logique
    @Transactional
    public void deleteClient(Long id) {
        Client client = getClientById(id);
        List<Compte> comptes = compteRepository.findByClient(client);
        boolean aDesComptesActifs = comptes.stream().anyMatch(c -> c.getSolde().doubleValue() > 0);
        if (aDesComptesActifs) {
            throw new BanqueException("Impossible de désactiver ce client : il possède des comptes avec un solde positif.");
        }
        client.setEstSupprime(true);
        clientRepository.save(client);
    }

    //Rechercher un client par son nom ou prénom
    public List<Client> rechercherParNomOuPrenom(String valeur) {
        if (valeur == null || valeur.isBlank()) {
            return clientRepository.findByEstSupprimeFalse();
        }
        return clientRepository.rechercherParNomOuPrenom(valeur);
    }

    // Rechercher un client avec son numéro
    public Client rechercherParTelephone(String telephone) {
        String tel = clientHelpers.normaliserTelephone(telephone);
        return clientRepository.findByTelephoneAndEstSupprimeFalse(tel)
                .orElseThrow(() -> new BanqueException("Aucun client trouvé avec ce numéro : " + telephone));
    }

    //Rechercher un client avec son email
    public Client rechercherParEmail(String email) {
        if (!clientHelpers.isEmail(email)) {
            throw new IllegalArgumentException("Email invalide : " + email);
        }
        return clientRepository.findByEmailAndEstSupprimeFalse(email).orElseThrow(()-> new BanqueException("Aucun client avec cet email : " + email));
    }

}
