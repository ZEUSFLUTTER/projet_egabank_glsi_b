package banque.controller;

import banque.dto.AuthResponseDto;
import banque.dto.LoginDto;
import banque.dto.RegisterDto;
import banque.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * INSCRIPTION
     * Accès : Public
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto request) {
        authService.register(request);
        return ResponseEntity.ok("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    }

    /**
     * CONNEXION
     * Accès : Public
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto request) {
        return ResponseEntity.ok(authService.login(request));
    }
}