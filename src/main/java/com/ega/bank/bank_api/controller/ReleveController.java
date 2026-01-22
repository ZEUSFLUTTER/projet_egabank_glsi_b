package com.ega.bank.bank_api.controller;

import com.ega.bank.bank_api.service.ReleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReleveController {
    
    private final ReleveService releveService;
    
    @GetMapping("/compte/{numeroCompte}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> genererReleve(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        
        String releve = releveService.genererReleve(numeroCompte, dateDebut, dateFin);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "releve_" + numeroCompte + ".txt");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(releve);
    }
    
    @GetMapping("/compte/{numeroCompte}/view")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> voirReleve(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {
        
        String releve = releveService.genererReleve(numeroCompte, dateDebut, dateFin);
        
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(releve);
    }
}