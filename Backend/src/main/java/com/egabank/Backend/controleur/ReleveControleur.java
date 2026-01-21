/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.controleur;

import com.egabank.Backend.service.ReleveService;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author HP
 */
@RestController
@RequestMapping("/api/releves")
public class ReleveControleur {
    private final ReleveService serviceReleves;

    public ReleveControleur(ReleveService serviceReleves) {
        this.serviceReleves = serviceReleves;
    }

    @GetMapping("/{numeroCompte}")
    public ResponseEntity<byte[]> telechargerReleve(
            @PathVariable String numeroCompte,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) {
        byte[] pdf = serviceReleves.genererRelevePdf(numeroCompte, dateDebut, dateFin);

        HttpHeaders enTetes = new HttpHeaders();
        enTetes.setContentType(MediaType.APPLICATION_PDF);
        enTetes.setContentDisposition(ContentDisposition.attachment().filename("releve_" + numeroCompte + ".pdf").build());
        return new ResponseEntity<>(pdf, enTetes, HttpStatus.OK);
    }
}
