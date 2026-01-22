package com.iai.projet.banque.controllers;

import com.iai.projet.banque.entity.Client;
import com.iai.projet.banque.entity.Compte;
import com.iai.projet.banque.service.ClientService;
import com.iai.projet.banque.service.CompteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comptes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompteController {
    @Autowired
    private CompteService compteService;

    @PostMapping("/create")
    public ResponseEntity createCompte(@RequestBody Compte compte) {
        Compte  createdCompte = compteService.create(compte);
        return new ResponseEntity<>(createdCompte, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity deleteCompte(@RequestBody Compte compte) {
        try {
            Boolean co = compteService.delete(compte);
            return new ResponseEntity<>("Suprimer avec succès", HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
    @PutMapping("/update")
    public ResponseEntity updateCompte(@RequestBody Compte compte) {
        try {
            Compte co = compteService.update(compte);
            return new ResponseEntity<>("Modifier avec succès", HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

}
