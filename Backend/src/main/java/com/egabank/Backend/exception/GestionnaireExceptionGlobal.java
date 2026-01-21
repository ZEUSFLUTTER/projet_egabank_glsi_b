/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 *
 * @author HP
 */
@RestControllerAdvice
public class GestionnaireExceptionGlobal {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> gererValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> reponse = new HashMap<>();
        Map<String, String> erreurs = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(erreur ->
            erreurs.put(erreur.getField(), erreur.getDefaultMessage())
        );
        
        reponse.put("message", "Erreur de validation");
        reponse.put("messages", erreurs);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(reponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> gererAuthentification(AuthenticationException ex) {
        Map<String, String> reponse = new HashMap<>();
        reponse.put("message", "Erreur d'authentification");
        reponse.put("erreur", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(reponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> gererMauvaisIdentifiant(BadCredentialsException ex) {
        Map<String, String> reponse = new HashMap<>();
        reponse.put("message", "Identifiants incorrects");
        reponse.put("erreur", "Le nom d'utilisateur ou le mot de passe est incorrect");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(reponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> gererArgumentInvalide(IllegalArgumentException ex) {
        Map<String, String> reponse = new HashMap<>();
        reponse.put("message", "Erreur de requête");
        reponse.put("erreur", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(reponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> gererErreurGlobal(Exception ex) {
        Map<String, String> reponse = new HashMap<>();
        reponse.put("message", "Erreur serveur");
        reponse.put("erreur", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(reponse);
    }
}
