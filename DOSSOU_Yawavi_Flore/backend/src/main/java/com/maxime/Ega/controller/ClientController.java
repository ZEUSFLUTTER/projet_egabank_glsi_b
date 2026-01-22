package com.maxime.Ega.controller;

import com.maxime.Ega.Exeption.ApiResponse;
import com.maxime.Ega.dto.ClientListDto;
import com.maxime.Ega.dto.ClientUpdateDto;
import com.maxime.Ega.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    //controller pour detailler un client
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/detail/{codeClient}")
    public ResponseEntity<ClientListDto> findByCodeClient(@PathVariable String codeClient){
        return ResponseEntity.ok(clientService.findByCodeClient(codeClient));
    }

    @PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping(path = "/details/{email}")
    public ResponseEntity<ClientListDto> findByMailClient(@PathVariable String email){
        return ResponseEntity.ok(clientService.findByMailClient(email));
    }

    //controller pour lister les clients non supprimer
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/clientActif")
    public ResponseEntity<List<ClientListDto>> findAllActif(){
        return ResponseEntity.ok(clientService.findAllActif());
    }

    //controller pour lister les clients supprimer
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/clientInactif")
    public ResponseEntity<List<ClientListDto>> findAllInActif(){
        return ResponseEntity.ok(clientService.findAllInActif());
    }

    //controller pour supprimer un client
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @PutMapping(path = "/delete/{codeClient}")
    public ResponseEntity<ApiResponse> delete(@PathVariable String codeClient){
        clientService.delete(codeClient);
        return ResponseEntity.ok(new ApiResponse("Client deleted"));
    }

    //controller pour modifier un client
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @PutMapping(path = "/modifier/{codeClient}")
    public ResponseEntity<ApiResponse> updateClient(
            @RequestBody ClientUpdateDto clientUpdateDto,
            @PathVariable String codeClient){
        clientService.updateClient(clientUpdateDto, codeClient);
        return ResponseEntity.ok(new ApiResponse("Client updated"));
    }
}
