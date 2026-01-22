package com.maxime.Ega.service;

import com.maxime.Ega.Exeption.BadRequestException;
import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.dto.ClientListDto;
import com.maxime.Ega.dto.ClientUpdateDto;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.Client;
import com.maxime.Ega.mappers.ClientListDtoMapper;
import com.maxime.Ega.repository.AccountRepository;
import com.maxime.Ega.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientListDtoMapper clientListDtoMapper;
    private final AccountRepository accountRepository;

    //methode pour avoir plus d'information sur un client
    public ClientListDto findByCodeClient(String codeClient) {
        Client client = clientRepository.findByCodeClient(codeClient)
                .orElseThrow(() -> new ResourceNotFoundException("ce client n'existe pas"));
        return clientListDtoMapper.toDto(client);
    }


    public ClientListDto findByMailClient(String email) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("ce client n'existe pas"));
        return clientListDtoMapper.toDto(client);
    }

    //methode pour lister les client actifs
    public List<ClientListDto> findAllActif(){
        return clientRepository.findAllByDeletedFalse()
                .stream()
                .map(clientListDtoMapper::toDto)
                .collect(Collectors.toList());
    }


    //methode pour lister les clients supprimés
    public List<ClientListDto> findAllInActif(){
        return clientRepository.findAllByDeletedTrue()
                .stream()
                .map(clientListDtoMapper::toDto)
                .collect(Collectors.toList());
    }

    //methode pour supprimer un client
    public void delete(String codeClient){
        Client client = clientRepository.findByCodeClient(codeClient)
                .orElseThrow(() -> new ResourceNotFoundException("ce client n'existe pas"));
        if (client.isDeleted()){
            throw new BadRequestException("client deja supprimer");
        }
        client.setDeleted(true);

        //on supprime aussi les comptes liés a ce client en même temps

        List<Account> accounts = accountRepository.findByClient(client);
        for (Account account : accounts) {
            account.setDeleted(true);
            accountRepository.save(account);
        }
        clientRepository.save(client);
    }

    //methode pour modifier un client
    public void updateClient(ClientUpdateDto clientUpdateDto, String codeClient){
        Client client = clientRepository.findByCodeClient(codeClient)
                .orElseThrow(() -> new ResourceNotFoundException("ce client n'existe pas"));
        client.setAddress(clientUpdateDto.getAddress());
        client.setPhoneNumber(clientUpdateDto.getPhoneNumber());
        client.setEmail(clientUpdateDto.getEmail());
        clientRepository.save(client);
    }

}
