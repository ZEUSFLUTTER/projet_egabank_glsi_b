package com.ega.backend.web;

import com.ega.backend.dto.client.ClientRequest;
import com.ega.backend.dto.client.ClientResponse;
import com.ega.backend.repository.UserAccountRepository;
import com.ega.backend.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;
    private final UserAccountRepository userAccountRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> create(@RequestBody @Valid ClientRequest req, Authentication authentication) {
        // Si c'est un client, vérifier qu'il crée son propre profil (même email)
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CLIENT"))) {
            String username = authentication.getName();
            // Récupérer l'email de l'utilisateur connecté
            var userOpt = userAccountRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                String userEmail = userOpt.get().getEmail();
                // Pour un client, l'email doit correspondre à celui de l'utilisateur connecté
                if (!userEmail.equals(req.email())) {
                    throw new RuntimeException("Un client ne peut créer que son propre profil avec l'email: " + userEmail);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @clientService.isOwner(#id, authentication.name))")
    public ResponseEntity<ClientResponse> get(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(clientService.get(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ClientResponse>> list() {
        return ResponseEntity.ok(clientService.list());
    }

    @GetMapping("/current")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> getCurrentClient(Authentication authentication) {
        String username = authentication.getName();
        System.out.println("DEBUG: Username from authentication: " + username);
        
        // Récupérer l'email de l'utilisateur connecté
        var userOpt = userAccountRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: User not found for username: " + username);
            throw new RuntimeException("Utilisateur non trouvé");
        }
        
        String email = userOpt.get().getEmail();
        System.out.println("DEBUG: Email retrieved from database: " + email);
        
        if (email == null || email.isEmpty()) {
            System.out.println("DEBUG: Email is null or empty for user: " + username);
            throw new RuntimeException("CUSTOM ERROR: Email non trouvé pour l'utilisateur: " + username);
        }
        
        System.out.println("DEBUG: Calling clientService.getByEmail with: " + email);
        return ResponseEntity.ok(clientService.getByEmail(email));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @clientService.isOwner(#id, authentication.name))")
    public ResponseEntity<ClientResponse> update(@PathVariable Long id, @RequestBody @Valid ClientRequest req, Authentication authentication) {
        return ResponseEntity.ok(clientService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
