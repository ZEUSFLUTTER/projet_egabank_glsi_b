package com.bank.ega.exception;

import com.bank.ega.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation des @NotBlank, @Email, etc.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ApiResponse<?> response = ApiResponse.error("Erreur de validation", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Solde insuffisant
    @ExceptionHandler(SoldeInsuffisantException.class)
    public ResponseEntity<ApiResponse<?>> handleSoldeInsuffisant(SoldeInsuffisantException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Compte non trouvé
    @ExceptionHandler(CompteNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleCompteNotFound(CompteNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // Client non trouvé
    @ExceptionHandler(ClientNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleClientNotFound(ClientNotFoundException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // Argument invalide
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<?>> handleIllegalArgument(IllegalArgumentException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Exception générique
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntimeException(RuntimeException ex) {
        ApiResponse<?> response = ApiResponse.error("Erreur serveur: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 401 Unauthorized
    @ExceptionHandler(IllegalAccessException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(IllegalAccessException ex) {
        ApiResponse<?> response = ApiResponse.error("Accès non autorisé");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
