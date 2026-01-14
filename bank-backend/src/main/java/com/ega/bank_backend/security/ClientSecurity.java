package com.ega.bank_backend.security;

import com.ega.bank_backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("clientSecurity")
public class ClientSecurity {

    private final UserRepository userRepository;

    public ClientSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isOwner(Authentication authentication, Long clientId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .map(user -> user.getClient() != null && user.getClient().getId().equals(clientId))
                .orElse(false);
    }

    public boolean isAccountOwner(Authentication authentication, String accountNumber) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .map(user -> user.getClient() != null &&
                        user.getClient().getAccounts().stream()
                                .anyMatch(acc -> acc.getAccountNumber().equals(accountNumber)))
                .orElse(false);
    }
}
