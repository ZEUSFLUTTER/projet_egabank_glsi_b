package banque.controller;

import banque.entity.Client;
import banque.service.ClientService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    /**
     * 1. LISTE DE TOUS LES CLIENTS (Admin seulement)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    /**
     * 2. CHERCHER UN CLIENT PAR ID
     * (Accessible aux Admins et aux Clients authentifiés)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Client> getClientById(@PathVariable Long id) {
        // Le service renvoie directement le client ou lance une erreur
        Client client = clientService.getClientById(id);

        // On l'enveloppe simplement dans une réponse HTTP 200 OK
        return ResponseEntity.ok(client);
    }


    /**
     * 3. CRÉATION MANUELLE (Admin)
     * Note : L'inscription normale passe par /api/auth/register
     * Cette route sert si un Admin veut créer un dossier client manuellement sans compte utilisateur immédiat.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientService.createClient(client));
    }

    /**
     * 4. MISE À JOUR (Admin)
     * Pour modifier une adresse, un téléphone, etc.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }

    /**
     * 5. SUPPRESSION / DÉSACTIVATION (Admin)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Client supprimé avec succès"),
            @ApiResponse(responseCode = "404", description = "Client non trouvé")
    })
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 6. RECHERCHE INTELLIGENTE (Admin)
     * Ex: /api/clients/search?q=tg99... ou /api/clients/search?q=Koffi
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Client>> searchClients(@RequestParam("q") String query) {
        return ResponseEntity.ok(clientService.rechercherClient(query));
    }
}