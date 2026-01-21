package com.egabank.Backend.controleur;

import com.egabank.Backend.dto.ReleveClientDTO;
import com.egabank.Backend.service.ReleveClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/releves-client")
public class ReleveClientControleur {
    
    private final ReleveClientService serviceReleveClient;

    public ReleveClientControleur(ReleveClientService serviceReleveClient) {
        this.serviceReleveClient = serviceReleveClient;
    }

    @PostMapping("/generer")
    public ResponseEntity<byte[]> genererReleve(@Valid @RequestBody ReleveClientDTO dto, 
                                              Authentication authentication) {
        byte[] pdfBytes = serviceReleveClient.genererRelevePdf(
            dto.compteId(), 
            dto.dateDebut(), 
            dto.dateFin(), 
            authentication.getName()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", 
            "releve_" + dto.compteId() + "_" + dto.dateDebut() + "_" + dto.dateFin() + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}