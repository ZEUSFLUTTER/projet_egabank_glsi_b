package com.ega.backend.service;

import com.ega.backend.domain.Client;
import com.ega.backend.dto.client.ClientRequest;
import com.ega.backend.dto.client.ClientResponse;
import com.ega.backend.exception.ClientNotFoundException;
import com.ega.backend.repository.AccountRepository;
import com.ega.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;

    public ClientResponse create(ClientRequest req) {
        Client c = Client.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .birthDate(req.birthDate())
                .gender(req.gender())
                .address(req.address())
                .phone(req.phone())
                .email(req.email())
                .nationality(req.nationality())
                .build();
        c = clientRepository.save(c);
        return toDto(c);
    }

    @Transactional(readOnly = true)
    public ClientResponse get(Long id) {
        Client c = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + id));
        return toDto(c);
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> list() {
        return clientRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ClientResponse getByUsername(String username) {
        Client c = clientRepository.findByEmail(username)
                .orElseThrow(() -> new ClientNotFoundException("Client not found with email: " + username));
        return toDto(c);
    }

    @Transactional(readOnly = true)
    public boolean isOwner(Long clientId, String username) {
        return clientRepository.findById(clientId)
                .map(client -> client.getEmail().equals(username))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public ClientResponse getByEmail(String email) {
        System.out.println("DEBUG ClientService.getByEmail called with: " + email);
        Client c = clientRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: Client not found in database for email: " + email);
                    return new ClientNotFoundException("Client not found with email: " + email);
                });
        System.out.println("DEBUG: Client found: " + c.getFirstName() + " " + c.getLastName());
        return toDto(c);
    }

    public ClientResponse update(Long id, ClientRequest req) {
        Client c = clientRepository.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + id));
        c.setFirstName(req.firstName());
        c.setLastName(req.lastName());
        c.setBirthDate(req.birthDate());
        c.setGender(req.gender());
        c.setAddress(req.address());
        c.setPhone(req.phone());
        c.setEmail(req.email());
        c.setNationality(req.nationality());
        return toDto(c);
    }

    public void delete(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new ClientNotFoundException("Client not found: " + id);
        }
        clientRepository.deleteById(id);
    }

    public ClientResponse toDto(Client c) {
        Long accountCount = (long) accountRepository.findByOwnerId(c.getId()).size();
        // Un client est considéré actif s'il a au moins un compte ou si son email n'est pas vide
        Boolean active = accountCount > 0 || (c.getEmail() != null && !c.getEmail().isEmpty());
        return new ClientResponse(
                c.getId(),
                c.getFirstName(),
                c.getLastName(),
                c.getBirthDate(),
                c.getGender(),
                c.getAddress(),
                c.getPhone(),
                c.getEmail(),
                c.getNationality(),
                accountCount,
                active
        );
    }
}
