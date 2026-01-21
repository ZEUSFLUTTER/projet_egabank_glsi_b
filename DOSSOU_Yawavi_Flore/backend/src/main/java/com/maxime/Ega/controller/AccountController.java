package com.maxime.Ega.controller;

import com.maxime.Ega.Exeption.ApiResponse;
import com.maxime.Ega.dto.AccountDto;
import com.maxime.Ega.dto.AccountDtoCreateOld;
import com.maxime.Ega.dto.AccountListDto;
import com.maxime.Ega.dto.transaction.AccountListDto2;
import com.maxime.Ega.repository.ClientRepository;
import com.maxime.Ega.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/account")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;
    private final ClientRepository clientRepository;

    //controller pour creer un compte courant

//    @PreAuthorize("hasRole('GESTIONNAIRE')")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @PostMapping(path = "/newAccountClient")
    public ResponseEntity<ApiResponse> createAccountnew(@RequestBody AccountDto accountDto) {
        accountService.createAccountnew(accountDto);
        return ResponseEntity.ok(new ApiResponse ("compte creer avec succes"));
    }

    //controller pour creer un compte pour un utilisateur deja existant
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PostMapping(path = "/oldAccountClient")
    public ResponseEntity<ApiResponse> createAccountOld(@RequestBody AccountDtoCreateOld accountDtoCreateOld){
        accountService.createAccountold(accountDtoCreateOld);
        return ResponseEntity.ok(new ApiResponse("compte ajouter au client existant"));
    }

    //controller pour detailler les infos d'un compte
    @PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @GetMapping(path = "/detail/{accountNumber}")
    public ResponseEntity<AccountListDto> findByAccountNumber(@PathVariable String accountNumber){
        return ResponseEntity.ok(accountService.findByAccountNumber(accountNumber));
    }

    @PreAuthorize("hasAnyRole('GESTIONNAIRE','CAISSIERE')")
    @GetMapping(path = "/detail2/{accountNumber}")
    public ResponseEntity<AccountListDto2> findByAccountNumber2(@PathVariable String accountNumber){
        return ResponseEntity.ok(accountService.findByAccountNumber2(accountNumber));
    }

    //controller pour lister les comptes actifs
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/findAllActif")
    public ResponseEntity<List<AccountListDto> >findAllActf(){
        return ResponseEntity.ok(accountService.findAllActf());
    }

    //controller pour lister les comptes supprimer
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/findAllInActif")
    public ResponseEntity<List<AccountListDto> >findAllInActf(){
        return ResponseEntity.ok(accountService.findAllInActf());
    }

    //controller pour supprimer un compte
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @PutMapping(path = "/delete/{accountNumber}")
    public ResponseEntity<ApiResponse> deleteAccount(@PathVariable String accountNumber){
        accountService.deleteAccount(accountNumber);
        return ResponseEntity.ok(new ApiResponse("compte delete"));
    }

    //controlleur pour lister les comptes actifs associés a un client
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/clientAccountActif/{clientEmail}")
    public ResponseEntity<List<AccountListDto> >findAllAccountActifClient(@PathVariable String clientEmail){
        return ResponseEntity.ok(accountService.findAllAccountActifClient(clientEmail));
    }

    //controlleur pour lister les comptes inactifs associés a un client
    //@PreAuthorize("hasAnyRole('ADMIN','GESTIONNAIRE')")
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    @GetMapping(path = "/clientAccountInActif/{clientEmail}")
    public ResponseEntity<List<AccountListDto> >findAllAccountInActfClient(@PathVariable String clientEmail){
        return ResponseEntity.ok(accountService.findAllAccountInActfClient(clientEmail));
    }

}