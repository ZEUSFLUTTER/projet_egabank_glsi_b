package com.ega.service;

import com.ega.dto.UserCreateRequest;
import com.ega.dto.UserResponse;
import com.ega.dto.UserUpdateRequest;
import com.ega.model.Client;
import com.ega.model.Role;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByCourriel(request.courriel())) {
            throw new IllegalArgumentException("Courriel déjà utilisé");
        }
        // Un agent ne doit pas être lié à un client
        if (request.role() == Role.ROLE_AGENT && request.clientId() != null) {
            throw new IllegalStateException("Un agent bancaire ne peut pas être lié à un client");
        }

        // Un utilisateur client DOIT être lié à un client
        if (request.role() == Role.ROLE_USER && request.clientId() == null) {
            throw new IllegalStateException("Un utilisateur client doit être lié à un client");
        }

        Client client = null;
        if (request.clientId() != null) {
            client = clientRepository.findById(request.clientId())
                    .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));
        }

        User user = new User();
        user.setCourriel(request.courriel());
        user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        user.setRole(request.role());
        user.setClient(client);
        user.setEnabled(true);

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        if (request.motDePasse() != null) {
            user.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }
        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }

        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse findById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
    }

    @Override
    public List<UserResponse> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        // En banque : on ne supprime pas, on désactive
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        user.setEnabled(false);
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getCourriel(),
                user.getRole(),
                user.getEnabled(),
                user.getClient() != null ? user.getClient().getId() : null);
    }
}
