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

    public ClientServiceImpl(ClientRepository depotClient) {
        this.depotClient = depotClient;
    }

    @Override
    public Client creer(ClientCreationDTO dto) {
        Client client = new Client();
        appliquer(client, dto);
        return depotClient.save(client);
    }

    @Override
    public Client modifier(Long id, ClientCreationDTO dto) {
        Client client = trouver(id);
        appliquer(client, dto);
        return depotClient.save(client);
    }

    @Override
    public void supprimer(Long id) {
        depotClient.delete(trouver(id));
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

    private void appliquer(Client client, ClientCreationDTO dto) {
        client.setNom(dto.nom());
        client.setPrenom(dto.prenom());
        client.setDateNaissance(dto.dateNaissance());
        client.setSexe(dto.sexe());
        client.setAdresse(dto.adresse());
        client.setNumeroTelephone(dto.numeroTelephone());
        client.setCourriel(dto.courriel());
        client.setNationalite(dto.nationalite());
    }
}
