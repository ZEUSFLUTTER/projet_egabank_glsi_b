package com.ega.banking.controller;

import com.ega.banking.dto.TransactionDTO;
import com.ega.banking.service.RelevePdfService;
import com.ega.banking.service.ReleveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/releves")
@RequiredArgsConstructor
@Tag(name = "Relevés", description = "API de génération des relevés de compte")
public class ReleveController {

    private final ReleveService releveService;
    private final RelevePdfService relevePdfService;

    @GetMapping("/{compteId}")
    @Operation(summary = "Obtenir les transactions d'un compte par période")
    public ResponseEntity<List<TransactionDTO>> obtenirReleveParPeriode(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {

        return ResponseEntity.ok(releveService.genererReleve(compteId, dateDebut, dateFin));
    }

    @GetMapping("/{compteId}/mensuel")
    @Operation(summary = "Obtenir le relevé mensuel d'un compte")
    public ResponseEntity<List<TransactionDTO>> obtenirReleveMensuel(
            @PathVariable Long compteId,
            @RequestParam int annee,
            @RequestParam int mois) {

        return ResponseEntity.ok(releveService.genererReleveMensuel(compteId, annee, mois));
    }

    @GetMapping("/{compteId}/annuel")
    @Operation(summary = "Obtenir le relevé annuel d'un compte")
    public ResponseEntity<List<TransactionDTO>> obtenirReleveAnnuel(
            @PathVariable Long compteId,
            @RequestParam int annee) {

        return ResponseEntity.ok(releveService.genererReleveAnnuel(compteId, annee));
    }

    // ======================== ENDPOINTS PDF ========================

    @GetMapping(value = "/{compteId}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Télécharger le relevé PDF par période")
    public ResponseEntity<byte[]> telechargerRelevePdf(
            @PathVariable Long compteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFin) {

        byte[] pdfContent = relevePdfService.genererRelevePdf(compteId, dateDebut, dateFin);

        String filename = String.format("releve_compte_%d_%s_%s.pdf",
                compteId,
                dateDebut.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                dateFin.format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .body(pdfContent);
    }

    @GetMapping(value = "/{compteId}/mensuel/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Télécharger le relevé mensuel en PDF")
    public ResponseEntity<byte[]> telechargerReleveMensuelPdf(
            @PathVariable Long compteId,
            @RequestParam int annee,
            @RequestParam int mois) {

        byte[] pdfContent = relevePdfService.genererReleveMensuelPdf(compteId, annee, mois);

        String filename = String.format("releve_compte_%d_%d_%02d.pdf", compteId, annee, mois);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .body(pdfContent);
    }

    @GetMapping(value = "/{compteId}/annuel/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Télécharger le relevé annuel en PDF")
    public ResponseEntity<byte[]> telechargerReleveAnnuelPdf(
            @PathVariable Long compteId,
            @RequestParam int annee) {

        byte[] pdfContent = relevePdfService.genererReleveAnnuelPdf(compteId, annee);

        String filename = String.format("releve_compte_%d_%d.pdf", compteId, annee);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                .body(pdfContent);
    }
}
