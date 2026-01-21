package com.ega.service;

import com.ega.dto.ClientDTO;

import java.util.List;

public interface ClientService {

    List<ClientDTO> getAllClients();

    ClientDTO getClientById(Long id);

    ClientDTO createClient(ClientDTO dto);

    ClientDTO updateClient(Long id, ClientDTO dto);

    void desactiverClient(Long id);
}
