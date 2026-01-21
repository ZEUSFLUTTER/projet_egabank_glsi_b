/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author HP
 */
@RestControllerAdvice
public class GestionnaireGlobalExceptions {
    @ExceptionHandler(RessourceIntrouvableException.class)
    public ResponseEntity<Map<String, Object>> gererIntrouvable(RessourceIntrouvableException ex) {
        return construire(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ExceptionMetier.class)
    public ResponseEntity<Map<String, Object>> gererMetier(ExceptionMetier ex) {
        return construire(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gererValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erreurs = new HashMap<>();
        for (FieldError erreur : ex.getBindingResult().getFieldErrors()) {
            erreurs.put(erreur.getField(), erreur.getDefaultMessage());
        }
        Map<String, Object> corps = new HashMap<>();
        corps.put("horodatage", LocalDateTime.now());
        corps.put("statut", 400);
        corps.put("erreur", "VALIDATION");
        corps.put("messages", erreurs);
        return ResponseEntity.badRequest().body(corps);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> gererEtatIllegal(IllegalStateException ex) {
        return construire(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> gererArgumentIllegal(IllegalArgumentException ex) {
        return construire(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> gererInattendue(Exception ex) {
        // Log l'erreur pour le débogage
        ex.printStackTrace();
        return construire(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne du serveur.");
    }

    private ResponseEntity<Map<String, Object>> construire(HttpStatus statut, String message) {
        Map<String, Object> corps = new HashMap<>();
        corps.put("horodatage", LocalDateTime.now());
        corps.put("statut", statut.value());
        corps.put("erreur", statut.getReasonPhrase());
        corps.put("message", message);
        return ResponseEntity.status(statut).body(corps);
    }
}
