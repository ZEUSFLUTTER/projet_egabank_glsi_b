package com.iai.ega_bank.services;

import java.util.List;
import com.iai.ega_bank.entities.Client;
import com.iai.ega_bank.dto.ClientDto;

public interface ClientService {
    void createNewClient(ClientDto clientDto);
    List<Client> findAll();
    Client findOne(long id);
    Client updateClient(long id, ClientDto dto);
    void deleteClient(long id);

}
