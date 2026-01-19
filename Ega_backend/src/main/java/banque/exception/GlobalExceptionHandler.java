package banque.exception;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. GESTION DES ERREURS MÉTIER (Vos règles : Solde, Clôture, etc.)
    @ExceptionHandler(BanqueException.class)
    public ResponseEntity<ErrorResponse> handleBanqueException(BanqueException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Erreur Métier", ex.getMessage(), request.getRequestURI(), null);
    }

    // 2. GESTION DES ERREURS DE VALIDATION (@NotNull, @Email, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        // On récupère chaque champ en erreur
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return buildResponse(HttpStatus.BAD_REQUEST, "Validation échouée", "Certains champs sont invalides", request.getRequestURI(), errors);
    }

    // 3. GESTION DE LA SÉCURITÉ (Login, Token)
    @ExceptionHandler({BadCredentialsException.class, UsernameNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleAuthErrors(Exception ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Authentification échouée", "Email ou mot de passe incorrect", request.getRequestURI(), null);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleAccountDisabled(DisabledException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Compte désactivé", ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "Accès refusé", "Vous n'avez pas les droits pour effectuer cette action.", request.getRequestURI(), null);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(ExpiredJwtException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Session expirée", "Votre token a expiré, veuillez vous reconnecter.", request.getRequestURI(), null);
    }

    // 4. CATCH-ALL (Pour les RuntimeException génériques que vous n'avez pas encore migrées vers BanqueException)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Erreur de traitement", ex.getMessage(), request.getRequestURI(), null);
    }

    // 5. ERREURS INTERNES (Bugs imprévus, NullPointer, Database down...)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        ex.printStackTrace(); // Utile pour voir l'erreur dans la console serveur
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur Serveur", "Une erreur interne est survenue. Contactez l'admin.", request.getRequestURI(), null);
    }

    // --- Méthode utilitaire pour construire la réponse ---
    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String error, String message, String path, Map<String, String> validationErrors) {
        ErrorResponse response = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(error)
                .message(message)
                .path(path)
                .validationErrors(validationErrors)
                .build();
        return new ResponseEntity<>(response, status);
    }
}