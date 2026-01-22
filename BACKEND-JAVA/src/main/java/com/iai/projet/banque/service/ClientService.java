package com.iai.projet.banque.service;

import com.iai.projet.banque.entity.Client;
import com.iai.projet.banque.entity.Compte;
import com.iai.projet.banque.entity.Role;
import com.iai.projet.banque.entity.Utilisateur;
import com.iai.projet.banque.models.ClientDTO;
import com.iai.projet.banque.repository.ClientRepository;
import com.iai.projet.banque.repository.CompteRepository;
import com.iai.projet.banque.repository.RoleRepository;
import com.iai.projet.banque.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ClientService {
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private CompteRepository compteRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Client create(Client client) {
        Client c = clientRepository.save(client);
        return c;
    }

    public ClientDTO createWithDTO(ClientDTO client) {

       /*
        Enregister un client
        */
        Optional<Utilisateur> userName = utilisateurRepository.findByUsername(client.getUsername());
        if (userName.isPresent()) {
            throw new IllegalArgumentException("Le username  existe déja ");
        }
//        Optional<Utilisateur> email = utilisateurRepository.findByEmail(client.getEmail());
//        if (email.isPresent()) {
//            throw new IllegalArgumentException("Le email  existe déja ");
//        }
        Client c = new Client();
        c.setNom(client.getNom());
        c.setPrenom(client.getPrenom());
        c.setAdresse(client.getAdresse());
        c.setCouriel(client.getCourriel());
        c.setTelephone(client.getTelephone());
        c.setDateNaissance(new Date());
        c.setNationalite(client.getNationalite());
        c.setSexe(client.getSexe());
        /*
        Enregistrer son compte
         */

        Client client1 = clientRepository.save(c);
        Compte cpte = new Compte();
        if (client.getTypeCompte().equals(TypeCompte.EPARGNE.name().toString())) {
            cpte.setTypeCompte(TypeCompte.EPARGNE.toString());
        }
        cpte.setIdClient(client1.getId());
        cpte.setTypeCompte(TypeCompte.COURANT.toString());
        compteRepository.save(cpte);
        /*
        Enregitrer l'utilisateur
         */
        Utilisateur u = new Utilisateur();
        u.setEmail(client.getEmail());
        u.setUsername(client.getUsername());
        u.setClientId(client1.getId());
        u.setPassword(passwordEncoder.encode(client.getPassword()));

//        Optional userName = utilisateurRepository.findByUsername(client.getUsername());
//        if (userName.get() != null) {
//            throw new IllegalArgumentException("Le username  existe déja ");
//        }
        /*
        Enregsitrer roles
         */
        Role role = roleRepository.findById(3L)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé"));

        // 3. Ajouter le rôle à l'utilisateur
        u.getRoles().add(role);

        // 4. Sauvegarder l'utilisateur (la relation sera automatiquement sauvegardée)
        utilisateurRepository.save(u);
        return client;
    }

    public Client update(Client client) {
        Client c = new Client();
        if (client != null) {
            c.setId(client.getId());
            c.setAdresse(client.getAdresse());
            c.setDateNaissance(client.getDateNaissance());
            c.setCouriel(client.getCouriel());
            c.setNom(client.getNom());
            c.setPrenom(client.getPrenom());
            c.setNationalite(client.getNationalite());
            c.setSexe(client.getSexe());

        }
        return clientRepository.save(c);
    }

    public Boolean delete(Client client) {
        if (client != null && client.getId() != null) {
            Boolean c = clientRepository.existsById(client.getId());
            if (c.equals(Boolean.TRUE)) {
                clientRepository.delete(client);
                return true;
            } else
                return false;
        }
        return false;

    }

    public Boolean deleteByIdClient(Long id) {
        if (id != null) {
            Boolean c = clientRepository.existsById(id);
            if (c.equals(Boolean.TRUE)) {
                clientRepository.deleteById(id);
                return true;
            } else
                return false;
        }
        return false;

    }

    public ClientDTO getByUsername(String username) {
        Optional<Client> clt = Optional.empty();
        Compte cpte = new Compte();
        Optional<Utilisateur> c = utilisateurRepository.findByUsername(username);
        if (c.get().getClientId() != null) {
            clt = clientRepository.findById(c.get().getClientId());
        }
        if (clt.get().getId() != null) {
            cpte = compteRepository.findByIdClient(clt.get().getId());
        }
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setNom(clt.get().getNom());
        clientDTO.setPrenom(clt.get().getPrenom());
        clientDTO.setNumeroCompte(cpte.getNumeroCompte());
        clientDTO.setSolde(cpte.getSoldeCompte().equals(0D) ? "0" : String.valueOf(cpte.getSoldeCompte()));
        clientDTO.setTypeCompte(cpte.getTypeCompte());
        return clientDTO;
    }
}
