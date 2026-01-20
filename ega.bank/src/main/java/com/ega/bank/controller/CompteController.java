package com.ega.bank.controller;

import com.ega.bank.dto.CompteDTO;
import com.ega.bank.dto.RetraitRequest;
import com.ega.bank.dto.VersementRequest;
import com.ega.bank.dto.VirementRequest;
import com.ega.bank.entity.TypeCompte;
import com.ega.bank.service.CompteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller pour la gestion des comptes
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CompteController {

    private final CompteService compteService;

    // ==================== ENDPOINTS ADMIN ====================

    /**
     * Crée un nouveau compte
     * POST /api/admin/comptes
     * Paramètres:
     * - clientId: ID du client
     * - typeCompte: Type du compte (COMPTE_COURANT ou COMPTE_EPARGNE)
     * - decouvertAutorise: Découvert autorisé (optionnel)
     * - tauxInteret: Taux d'intérêt (optionnel)
     */
    @PostMapping("/admin/comptes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompteDTO> createCompte(
            @RequestParam Long clientId,
            @RequestParam String typeCompte,
            @RequestParam(required = false) BigDecimal decouvertAutorise,
            @RequestParam(required = false) Double tauxInteret) {
        try {
            TypeCompte type = TypeCompte.valueOf(typeCompte.toUpperCase());
            CompteDTO compte = compteService.createCompte(clientId, type, decouvertAutorise, tauxInteret);
            return new ResponseEntity<>(compte, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Récupère tous les comptes
     * GET /api/admin/comptes
     */
    @GetMapping("/admin/comptes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        List<CompteDTO> comptes = compteService.getAllComptes();
        return ResponseEntity.ok(comptes);
    }

    /**
     * Récupère un compte par son ID
     * GET /api/admin/comptes/{id}
     */
    @GetMapping("/admin/comptes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompteDTO> getCompteById(@PathVariable Long id) {
        CompteDTO compte = compteService.getCompteById(id);
        return ResponseEntity.ok(compte);
    }

    /**
     * Récupère tous les comptes d'un client
     * GET /api/admin/clients/{clientId}/comptes
     */
    @GetMapping("/admin/clients/{clientId}/comptes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompteDTO>> getComptesByClient(@PathVariable Long clientId) {
        List<CompteDTO> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }

    /**
     * Désactive un compte
     * DELETE /api/admin/comptes/{id}
     */
    @DeleteMapping("/admin/comptes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactiverCompte(@PathVariable Long id) {
        compteService.desactiverCompte(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ENDPOINTS CLIENT ====================

    /**
     * Récupère les comptes du client connecté
     * GET /api/client/mes-comptes
     */
    @GetMapping("/client/mes-comptes")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CompteDTO>> getMesComptes(@RequestParam Long clientId) {
        // TODO: Récupérer le clientId depuis le token JWT au lieu du paramètre
        List<CompteDTO> comptes = compteService.getComptesByClientId(clientId);
        return ResponseEntity.ok(comptes);
    }

    /**
     * Effectue un versement sur un compte
     * POST /api/client/versement
     */
    @PostMapping("/client/versement")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CompteDTO> versement(@Valid @RequestBody VersementRequest request) {
        CompteDTO compte = compteService.versement(
                request.getCompteId(),
                request.getMontant(),
                request.getDescription());
        return ResponseEntity.ok(compte);
    }

    /**
     * Effectue un retrait sur un compte
     * POST /api/client/retrait
     */
    @PostMapping("/client/retrait")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CompteDTO> retrait(@Valid @RequestBody RetraitRequest request) {
        CompteDTO compte = compteService.retrait(
                request.getCompteId(),
                request.getMontant(),
                request.getDescription());
        return ResponseEntity.ok(compte);
    }

    /**
     * Effectue un virement d'un compte à un autre
     * POST /api/client/virement
     */
    @PostMapping("/client/virement")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CompteDTO> virement(@Valid @RequestBody VirementRequest request) {
        CompteDTO compte = compteService.virement(
                request.getCompteSourceId(),
                request.getCompteBeneficiaire(),
                request.getMontant(),
                request.getDescription());
        return ResponseEntity.ok(compte);
    }
}