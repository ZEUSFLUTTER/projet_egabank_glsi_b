package banque.controller;

import banque.entity.Client;
import banque.entity.Compte;
import banque.service.CompteService; // ✅ Ajout nécessaire
import banque.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final CompteService compteService; // ✅ On injecte ceci pour récupérer les infos client

    /**
     * 1. TÉLÉCHARGER LE RIB
     */
    @GetMapping("/rib/{numeroCompte}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<byte[]> downloadRib(@PathVariable String numeroCompte) {
        // 1. Récupérer les infos du compte pour le nom du fichier
        Compte compte = compteService.getCompteByNumero(numeroCompte);
        Client client = compte.getClient();

        // 2. Génération du PDF
        byte[] pdfContent = reportService.genererRibPdf(numeroCompte);

        // 3. Construction du nom de fichier dynamique
        // Ex: rib_KOFFI_Jean_TG00123.pdf
        String filename = "rib_" + client.getNom() + "_" + client.getPrenom() + "_" + numeroCompte + ".pdf";

        // Nettoyage : On remplace les espaces par des underscores pour la compatibilité Web
        filename = filename.replaceAll("\\s+", "_");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", filename); // ✅ Nom concaténé

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }

    /**
     * 2. TÉLÉCHARGER LE RELEVÉ DE COMPTE
     */
    @GetMapping("/releve/{numeroCompte}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<byte[]> downloadReleve(
            @PathVariable String numeroCompte,
            @RequestParam("debut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        // 1. Récupérer les infos pour le nom du fichier
        Compte compte = compteService.getCompteByNumero(numeroCompte);
        Client client = compte.getClient();

        LocalDateTime dateDebut = debut.atStartOfDay();
        LocalDateTime dateFin = fin.atTime(LocalTime.MAX);

        // 2. Génération
        byte[] pdfContent = reportService.genererRelevePdf(numeroCompte, dateDebut, dateFin);

        // 3. Construction du nom de fichier
        // Ex: releve_KOFFI_Jean_2024-01-01_au_2024-01-31.pdf
        String filename = "releve_" + client.getNom() + "_" + client.getPrenom() + "_" + debut + "_au_" + fin + ".pdf";
        filename = filename.replaceAll("\\s+", "_");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }
}