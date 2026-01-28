package com.ega.ega_bank.service;

import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.dto.ClientRequest;
import com.ega.ega_bank.exception.NotFoundException;
import com.ega.ega_bank.repository.ClientRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository repo;

    public ClientService(ClientRepository repo) {
        this.repo = repo;
    }

    public Client create(ClientRequest req) {
        var c = new Client();
        BeanUtils.copyProperties(req, c);
        return repo.save(c);
    }

    public Client update(Long id, ClientRequest req) {
        var c = repo.findById(id).orElseThrow(() -> new NotFoundException("Client introuvable"));
        BeanUtils.copyProperties(req, c);
        return repo.save(c);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Client get(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Client introuvable"));
    }

    public List<Client> list() {
        return repo.findAll();
    }


    public Client getByEmail(String email) {
        return repo.findByCourriel(email)
                .orElseThrow(() -> new NotFoundException("Client introuvable avec email : " + email));
    }
}
