package banque.controller;

import banque.dto.DemandeCreationDto;
import banque.entity.DemandeCompte;
import banque.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
public class DemandeController {

    private final DemandeService demandeService;

    /**
     * 1. CRÉER UNE DEMANDE (Client)
     * POST /api/demandes
     * Body: { "clientId": 1, "typeCompte": "COURANT" }
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DemandeCompte> creerDemande(@RequestBody DemandeCreationDto dto) {
        return ResponseEntity.ok(
                demandeService.creerDemande(dto.getClientId(), dto.getTypeCompte())
        );
    }

    /**
     * 2. VOIR MES DEMANDES (Client) ou CELLES D'UN CLIENT (Admin)
     * GET /api/demandes/client/1
     */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<List<DemandeCompte>> getDemandesClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(demandeService.getDemandesClient(clientId));
    }

    /**
     * 3. VOIR LES DEMANDES EN ATTENTE (Admin - Dashboard)
     * GET /api/demandes/attente
     */
    @GetMapping("/attente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DemandeCompte>> getDemandesEnAttente() {
        return ResponseEntity.ok(demandeService.getDemandesEnAttente());
    }

    /**
     * 4. VALIDER UNE DEMANDE (Admin)
     * POST /api/demandes/5/valider
     * Note : On utilise 'Principal' pour récupérer automatiquement le username de l'admin connecté.
     */
    @PostMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> validerDemande(@PathVariable Long id, Principal principal) {
        // principal.getName() retourne l'email/username du token JWT
        demandeService.validerDemande(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    /**
     * 5. REJETER UNE DEMANDE (Admin)
     * POST /api/demandes/5/rejeter?motif=Pas%20assez%20de%20fonds
     */
    @PostMapping("/{id}/rejeter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rejeterDemande(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Dossier incomplet") String motif,
            Principal principal) {

        demandeService.rejeterDemande(id, principal.getName(), motif);
        return ResponseEntity.ok().build();
    }
}