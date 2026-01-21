package com.banque.controller;

import com.banque.service.ReleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
public class ReleveController {
    
    private final ReleveService releveService;
    
    @GetMapping("/compte/{compteId}")
    public ResponseEntity<byte[]> generateReleve(
            @PathVariable Long compteId,
            @RequestParam(required = false) String dateDebut,
            @RequestParam(required = false) String dateFin) {
        try {
            LocalDateTime debut = dateDebut != null ? LocalDateTime.parse(dateDebut) : null;
            LocalDateTime fin = dateFin != null ? LocalDateTime.parse(dateFin) : null;
            
            byte[] pdfBytes = releveService.generateRelevePdf(compteId, debut, fin);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "releve_compte_" + compteId + ".pdf");
            headers.setContentLength(pdfBytes.length);
            
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("non trouvé")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


