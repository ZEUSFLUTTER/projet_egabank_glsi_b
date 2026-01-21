/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import com.egabank.Backend.dto.ClientCreationDTO;
import com.egabank.Backend.entity.Client;
import com.egabank.Backend.exception.RessourceIntrouvableException;
import com.egabank.Backend.repository.ClientRepository;
import com.egabank.Backend.service.ClientService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class ClientServiceImpl implements ClientService{
    private final ClientRepository depotClient;
    private final BCryptPasswordEncoder encodeur;

    public ClientServiceImpl(ClientRepository depotClient, BCryptPasswordEncoder encodeur) {
        this.depotClient = depotClient;
        this.encodeur = encodeur;
    }

    @Override
    public Client creer(ClientCreationDTO dto) {
        if (depotClient.existsByCourriel(dto.courriel())) {
            throw new IllegalArgumentException("Un client existe déjà avec cet email");
        }
        
        if (depotClient.existsByNumeroTelephone(dto.numeroTelephone())) {
            throw new IllegalArgumentException("Un client existe déjà avec ce numéro de téléphone");
        }

        Client client = new Client();
        appliquer(client, dto);
        return depotClient.save(client);
    }

    @Override
    public Client modifier(Long id, ClientCreationDTO dto) {
        Client client = trouver(id);
        
        if (depotClient.existsByCourriel(dto.courriel()) && !client.getCourriel().equals(dto.courriel())) {
            throw new IllegalArgumentException("Un client existe déjà avec cet email");
        }
        
        if (depotClient.existsByNumeroTelephone(dto.numeroTelephone()) && !client.getNumeroTelephone().equals(dto.numeroTelephone())) {
            throw new IllegalArgumentException("Un client existe déjà avec ce numéro de téléphone");
        }
        
        appliquer(client, dto);
        return depotClient.save(client);
    }

    @Override
    public void supprimer(Long id) {
        Client client = trouver(id);
        
        // Vérifier s'il y a des comptes associés
        if (depotClient.aDesComptes(id)) {
            throw new IllegalStateException("Impossible de supprimer ce client car il possède des comptes bancaires. Veuillez d'abord fermer tous ses comptes.");
        }
        
        depotClient.delete(client);
    }

    public void supprimerAvecComptes(Long id) {
        Client client = trouver(id);
        
        // Cette méthode pourrait être utilisée pour une suppression forcée
        // mais nécessiterait une logique plus complexe pour gérer les transactions
        // Pour l'instant, on garde la suppression simple
        
        if (depotClient.aDesComptes(id)) {
            throw new IllegalStateException("Suppression impossible : le client possède des comptes avec des transactions. Contactez l'administrateur système.");
        }
        
        depotClient.delete(client);
    }

    @Override
    public Client trouver(Long id) {
        return depotClient.findById(id)
                .orElseThrow(() -> new RessourceIntrouvableException("Client introuvable : " + id));
    }

    @Override
    public List<Client> lister() {
        return depotClient.findAll();
    }

    public List<Client> listerClientsSansComptes() {
        return (List<Client>) depotClient.findClientsSansComptes();
    }

    private void appliquer(Client client, ClientCreationDTO dto) {
        client.setNom(dto.nom());
        client.setPrenom(dto.prenom());
        client.setDateNaissance(dto.dateNaissance());
        client.setSexe(dto.sexe());
        client.setAdresse(dto.adresse());
        client.setNumeroTelephone(dto.numeroTelephone());
        client.setCourriel(dto.courriel());
        client.setNationalite(dto.nationalite());
        client.setMotDePasse(encodeur.encode(dto.motDePasse()));
    }
}
