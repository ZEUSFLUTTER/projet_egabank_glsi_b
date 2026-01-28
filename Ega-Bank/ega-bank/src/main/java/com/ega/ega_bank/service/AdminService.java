package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.AdminRequest;
import com.ega.ega_bank.dto.ClientRequest;
import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.entite.enums.Role;
import com.ega.ega_bank.repository.ClientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final ClientRepository repo;
    private final PasswordEncoder encoder;

    public AdminService(ClientRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // --- ADMIN ---
    public Client createAdmin(AdminRequest req) {
        Client admin = new Client();
        admin.setCourriel(req.getCourriel());
        admin.setPassword(encoder.encode(req.getPassword())); // encodage automatique
        admin.setNom(req.getNom());
        admin.setPrenom(req.getPrenom());
        admin.setDateNaissance(req.getDateNaissance());
        admin.setSexe(req.getSexe());
        admin.setAdresse(req.getAdresse());
        admin.setTelephone(req.getTelephone());
        admin.setNationalite(req.getNationalite());
        admin.setRole(Role.ADMIN); // rôle forcé ADMIN
        return repo.save(admin);
    }

    // --- CLIENT CRUD ---
    // CREATE
    public Client createClient(ClientRequest req) {
        Client client = new Client();
        client.setCourriel(req.getCourriel());
        client.setPassword(encoder.encode(req.getPassword()));
        client.setNom(req.getNom());
        client.setPrenom(req.getPrenom());
        client.setDateNaissance(req.getDateNaissance());
        client.setSexe(req.getSexe());
        client.setAdresse(req.getAdresse());
        client.setTelephone(req.getTelephone());
        client.setNationalite(req.getNationalite());
        client.setRole(Role.CLIENT);
        return repo.save(client);
    }

    // READ - liste
    public List<Client> listClients() {
        return repo.findByRole(Role.CLIENT);
    }

    // Statistiques - compter les clients
    public long countClients() {
        return repo.countByRole(Role.CLIENT);
    }

    // Lister tous les admins (pour gestion interne)
    public List<Client> listAdmins() {
        return repo.findByRole(Role.ADMIN);
    }

    // READ - un seul
    public Client getClient(Long id) {
        Client c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec id " + id));
        if (c.getRole() != Role.CLIENT) {
            throw new RuntimeException("Cet utilisateur n'est pas un client");
        }
        return c;
    }

    // UPDATE
    public Client updateClient(Long id, ClientRequest req) {
        Client c = getClient(id);
        c.setNom(req.getNom());
        c.setPrenom(req.getPrenom());
        c.setDateNaissance(req.getDateNaissance());
        c.setSexe(req.getSexe());
        c.setAdresse(req.getAdresse());
        c.setTelephone(req.getTelephone());
        c.setNationalite(req.getNationalite());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            c.setPassword(encoder.encode(req.getPassword()));
        }
        return repo.save(c);
    }

    // DELETE
    public void deleteClient(Long id) {
        Client c = getClient(id);
        repo.delete(c);
    }
}
