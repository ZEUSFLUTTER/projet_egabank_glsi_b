package com.ega.controller;

import com.ega.service.ReleveService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReleveController {

    private final ReleveService releveService;

    // Mapping corrigé : /api/releves/{compteId}
    @GetMapping("/{compteId}")
    public ResponseEntity<byte[]> generateReleve(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {

        byte[] pdf = releveService.generateRelevePdf(compteId, dateDebut, dateFin);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("inline") // "inline" pour affichage navigateur
                .filename("releve_" + compteId + ".pdf")
                .build());
        headers.setContentLength(pdf.length);

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
