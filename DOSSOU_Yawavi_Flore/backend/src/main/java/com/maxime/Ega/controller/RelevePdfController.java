package com.maxime.Ega.controller;

import com.maxime.Ega.service.RelevePdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;


@RestController
@RequestMapping(path = "/doc")
@RequiredArgsConstructor
public class RelevePdfController {

    private final RelevePdfService relevePdfService;

   // @PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @PostMapping("/historique/pdf")
    public ResponseEntity<byte[]> getRelevePdf(
            @RequestParam String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) throws Exception {

        byte[] pdf = relevePdfService.genererReleve(
                accountNumber,
                dateDebut.atStartOfDay(),
                dateFin.atTime(23,59,59)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=releve.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }


}
