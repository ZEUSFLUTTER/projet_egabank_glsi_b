package banque.controller;

import banque.dto.OperationDto;
import banque.dto.VirementDto;
import banque.entity.Transaction;
import banque.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationController {

    private final OperationService operationService;

    /**
     * 1. VERSEMENT
     */
    @PostMapping("/versement")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> versement(@RequestBody OperationDto dto) {
        operationService.effectuerVersement(dto.getNumeroCompte(), dto.getMontant());
        return ResponseEntity.ok().build();
    }

    /**
     * 2. RETRAIT
     */
    @PostMapping("/retrait")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    public ResponseEntity<Void> retrait(@RequestBody OperationDto dto) {
        operationService.effectuerRetrait(dto.getNumeroCompte(), dto.getMontant());
        return ResponseEntity.ok().build();
    }

    /**
     * 3. VIREMENT (Compte à Compte)
     * Accessible aux Clients et Admins
     */
    @PostMapping("/virement")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> virement(@RequestBody VirementDto dto) {
        // Note de sécurité : Si c'est un CLIENT qui appelle, idéalement on devrait vérifier
        // ici que 'dto.getCompteEmetteur()' lui appartient bien via 'Principal'.
        // Pour l'instant, on laisse le service gérer la logique métier.

        operationService.effectuerVirement(
                dto.getCompteEmetteur(),
                dto.getCompteBeneficiaire(),
                dto.getMontant()
        );
        return ResponseEntity.ok().build();
    }
    @GetMapping("/historique/{numeroCompte}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<List<Transaction>> getHistorique(@PathVariable String numeroCompte) {
        return ResponseEntity.ok(operationService.getHistorique(numeroCompte));
    }
}