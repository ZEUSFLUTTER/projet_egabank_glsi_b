package banque.controller;

import banque.dto.UserUpdateDto;
import banque.entity.Utilisateur;
import banque.repository.UtilisateurRepository;
import banque.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final AuthService utilisateurService;
    private final UtilisateurRepository utilisateurRepository;

    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN')") // Sécurisé
    public ResponseEntity<List<Utilisateur>> GetAllUser() {
        return ResponseEntity.ok(utilisateurRepository.findAll());
    }
    /**
     * Modifier email et/ou mot de passe
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')") // Sécurisé
    public ResponseEntity<Utilisateur> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDto dto) {

        Utilisateur updatedUser = utilisateurService.updateUserCredentials(id, dto);
        return ResponseEntity.ok(updatedUser);
    }
}