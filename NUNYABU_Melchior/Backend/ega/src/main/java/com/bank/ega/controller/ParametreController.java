package com.bank.ega.controller;

import com.bank.ega.config.JwtUtil;
import com.bank.ega.dto.ApiResponse;
import com.bank.ega.entity.Parametre;
import com.bank.ega.service.ParametreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/parametres")
public class ParametreController {

    private final ParametreService parametreService;
    private final JwtUtil jwtUtil;

    public ParametreController(ParametreService parametreService, JwtUtil jwtUtil) {
        this.parametreService = parametreService;
        this.jwtUtil = jwtUtil;
    }

    // Obtenir tous les paramètres
    @GetMapping
    public ResponseEntity<ApiResponse<List<Parametre>>> getParametres(
            @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            List<Parametre> parametres = parametreService.getParametres(username);
            return ResponseEntity.ok(ApiResponse.success("Paramètres récupérés", parametres));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Token invalide"));
        }
    }

    // Obtenir un paramètre spécifique
    @GetMapping("/{cle}")
    public ResponseEntity<ApiResponse<Parametre>> getParametre(
            @RequestHeader("Authorization") String token,
            @PathVariable String cle) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            return parametreService.getParametre(username, cle)
                    .map(p -> ResponseEntity.ok(ApiResponse.success(p)))
                    .orElseGet(() -> ResponseEntity.status(404)
                            .body(ApiResponse.error("Paramètre non trouvé")));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Token invalide"));
        }
    }

    // Créer ou mettre à jour un paramètre
    @PostMapping
    public ResponseEntity<ApiResponse<Parametre>> saveParametre(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            String cle = request.get("cle");
            String valeur = request.get("valeur");

            if (cle == null || valeur == null) {
                return ResponseEntity.status(400)
                        .body(ApiResponse.error("Les champs 'cle' et 'valeur' sont obligatoires"));
            }

            Parametre parametre = parametreService.saveParametre(username, cle, valeur);
            return ResponseEntity.ok(ApiResponse.success("Paramètre sauvegardé", parametre));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Erreur: " + e.getMessage()));
        }
    }

    // Supprimer un paramètre
    @DeleteMapping("/{cle}")
    public ResponseEntity<ApiResponse<Void>> deleteParametre(
            @RequestHeader("Authorization") String token,
            @PathVariable String cle) {
        try {
            String username = jwtUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            parametreService.deleteParametre(username, cle);
            return ResponseEntity.ok(ApiResponse.success("Paramètre supprimé", null));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Erreur: " + e.getMessage()));
        }
    }
}
