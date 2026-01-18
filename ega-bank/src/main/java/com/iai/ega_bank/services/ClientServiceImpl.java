package com.iai.ega_bank.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.iai.ega_bank.dto.ClientDto;
import com.iai.ega_bank.entities.Client;
import com.iai.ega_bank.repositories.ClientRepository;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Autowired
    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public void createNewClient(ClientDto clientDto) {
        Client client = new Client();
        client.setFirstName(clientDto.getFirstName());
        client.setLastName(clientDto.getLastName());
        client.setBirthday(clientDto.getBirthday());
        client.setEmail(clientDto.getEmail());
        client.setPhone(clientDto.getPhone());
        client.setAddress(clientDto.getAddress());
        client.setNationality(clientDto.getNationality());
        client.setSex(clientDto.getSex());

        clientRepository.save(client);
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    @Override
    public Client findOne(long id) {
        return this.clientRepository.getReferenceById(id);
    }


    @Override
    public Client updateClient(long id, ClientDto dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setBirthday(dto.getBirthday());
        client.setPhone(dto.getPhone());
        client.setEmail(dto.getEmail());
        client.setAddress(dto.getAddress());
        client.setSex(dto.getSex());
        client.setNationality(dto.getNationality());

        return clientRepository.save(client);
    }


    @Override
    public void deleteClient(long id) {
        if (!clientRepository.existsById(id))
            throw new RuntimeException("Client introuvable");

        clientRepository.deleteById(id);
    }

}
