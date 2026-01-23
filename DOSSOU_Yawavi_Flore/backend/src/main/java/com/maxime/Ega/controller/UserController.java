package com.maxime.Ega.controller;

import com.maxime.Ega.Exeption.ApiResponse;
import com.maxime.Ega.dto.user.CreateUserDto;
import com.maxime.Ega.dto.user.ListUserDto;
import com.maxime.Ega.dto.user.LoginDto;
import com.maxime.Ega.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    //controller pour creer un gestionnaire
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "gestionnaire")
    public ResponseEntity<ApiResponse> createGestionnaire(@RequestBody CreateUserDto createUserDto) {
        this.userService.createGestionnaire(createUserDto);
        return ResponseEntity.ok(new ApiResponse("Gestionnaire creer avec succes"));
    }

    //methode pour creer un caissier
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "caissier")
    public ResponseEntity<ApiResponse> createCaissiere(@RequestBody CreateUserDto createUserDto) {
        this.userService.createCaissiere(createUserDto);
        return ResponseEntity.ok(new ApiResponse("Caissier créé avec succès"));
    }



    //controller pour la connexion
    @PostMapping(path = "/login", consumes = APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> login(@RequestBody LoginDto loginDto) {
        HashMap<String, String> hashMap = userService.login(loginDto);
        if (hashMap != null) {
            return new ResponseEntity<>(hashMap, HttpStatus.OK);
        }
        System.out.println("loginUtilisateur echec");
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    //controller pour afficher les utilisateurs actifs
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(path = "/userActif")
    public ResponseEntity<List<ListUserDto>> findAllUsersActive() {
        return ResponseEntity.ok(userService.findAllUsersActive());
    }

    //controller pour afficher les utilisateurs inactifs
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(path = "/userInactif")
    public ResponseEntity<List<ListUserDto>> findAllUsersInActive() {
        return ResponseEntity.ok(userService.findAllUsersInActive());
    }

    //controller pour desactiver un utilisateur
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "/desactive/{matricule}")
    public ResponseEntity<ApiResponse> desactiverUser(@PathVariable String matricule) {
        userService.desactiverUser(matricule);
        return ResponseEntity.ok(new ApiResponse("Utilisateur desactivé avec succes "));
    }

    //controller pour activer un utilisateur
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path = "/active/{matricule}")
    public ResponseEntity<ApiResponse> activerUser(@PathVariable String matricule) {
        userService.activerUser(matricule);
        return ResponseEntity.ok(new ApiResponse("Utilisateur activer avec succes "));
    }

}
