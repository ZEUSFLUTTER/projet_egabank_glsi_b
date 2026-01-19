package banque.controller;

import banque.dto.CreateCompteDto;
import banque.entity.Compte;
import banque.enums.StatutCompte;
import banque.enums.TypeCompte;
import banque.repository.CompteRepository;
import banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
public class CompteController {

    private final CompteService compteService;
    private final CompteRepository compteRepository;

    /**
     * 1. CRÉER UN COMPTE (Admin)
     * POST /api/comptes
     * Body: { "clientId": 1, "typeCompte": "EPARGNE" }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Compte> creerCompte(@RequestBody CreateCompteDto dto) {
        return ResponseEntity.ok(
                compteService.creerCompte(dto.getClientId(), dto.getTypeCompte())
        );
    }

    /**
     * 2. CHERCHER PAR NUMÉRO / IBAN (Admin + Client)
     * GET /api/comptes/TG00...
     */
    @GetMapping("/{numeroCompte}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Compte> getCompteByNumero(@PathVariable String numeroCompte) {
        return ResponseEntity.ok(compteService.getCompteByNumero(numeroCompte));
    }

    /**
     * 3. LISTER LES COMPTES D'UN CLIENT (Admin + Client)
     * GET /api/comptes/client/5
     */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")

    public ResponseEntity<List<Compte>> getComptesClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(compteRepository.findByClientId(clientId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Compte>> getAllComptes() {
        return ResponseEntity.ok(compteService.getAllComptes());
    }
    /**
     * 4. LISTER PAR TYPE (Admin - Statistique)
     * GET /api/comptes/type/EPARGNE
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    public ResponseEntity<List<Compte>> getComptesByType(@PathVariable TypeCompte type) {
        return ResponseEntity.ok(compteService.getComptesByType(type));
    }

    /**
     * 5. CHANGER LE STATUT (Bloquer/Suspendre) (Admin)
     * PATCH /api/comptes/TG00.../statut?statut=SUSPENDU
     */
    @PatchMapping("/{numeroCompte}/statut")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Compte> changerStatut(
            @PathVariable String numeroCompte,
            @RequestParam StatutCompte statut) {
        return ResponseEntity.ok(compteService.changerStatutCompte(numeroCompte, statut));
    }

    /**
     * 6. CLÔTURER DÉFINITIVEMENT (Admin)
     * DELETE /api/comptes/TG00...
     */
    @DeleteMapping("/{numeroCompte}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cloturerCompte(@PathVariable String numeroCompte) {
        compteService.cloturerCompte(numeroCompte);
        return ResponseEntity.noContent().build();
    }
}