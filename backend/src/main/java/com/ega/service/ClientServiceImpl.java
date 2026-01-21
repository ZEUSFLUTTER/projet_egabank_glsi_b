package com.ega.service;

import com.ega.dto.ClientDTO;
import com.ega.exception.BadRequestException;
import com.ega.exception.ResourceNotFoundException;
import com.ega.mapper.ClientMapper;
import com.ega.model.Client;
import com.ega.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper mapper;

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));
        return mapper.toDTO(client);
    }

    @Override
    public ClientDTO createClient(ClientDTO dto) {

        if (clientRepository.existsByCourriel(dto.getCourriel())) {
            throw new BadRequestException("Courriel déjà utilisé");
        }

        int age = Period.between(dto.getDateNaissance(), LocalDate.now()).getYears();
        if (age < 18) {
            throw new BadRequestException("Le client doit avoir au moins 18 ans");
        }

        Client client = mapper.toEntity(dto);
        client.setActif(true);

        return mapper.toDTO(clientRepository.save(client));
    }

    @Override
    public ClientDTO updateClient(Long id, ClientDTO dto) {

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        client.setNom(dto.getNom());
        client.setPrenom(dto.getPrenom());
        client.setAdresse(dto.getAdresse());
        client.setTelephone(dto.getTelephone());
        client.setNationalite(dto.getNationalite());

        return mapper.toDTO(clientRepository.save(client));
    }

    @Override
    public void desactiverClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable"));

        client.setActif(false);
        clientRepository.save(client);
    }
}
