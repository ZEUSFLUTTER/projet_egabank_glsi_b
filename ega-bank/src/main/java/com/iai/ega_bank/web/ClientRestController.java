package com.iai.ega_bank.web;


import com.iai.ega_bank.dto.ClientDto;
import com.iai.ega_bank.entities.Client;
import com.iai.ega_bank.services.ClientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/clients" )
public class ClientRestController {
    private final ClientService clientService;
    ClientRestController(ClientService clientService){
        this.clientService = clientService;
    }

    @PostMapping
    void  createClient(@RequestBody ClientDto dto){
        this.clientService.createNewClient(dto);
    }

    // READ - list
    @GetMapping
    public List<Client> findAll() {
        return clientService.findAll();
    }

    // READ - one
    @GetMapping("/{id}")
    public Client getClient(@PathVariable long id) {
        return clientService.findOne(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Client updateClient(@PathVariable long id,
                               @RequestBody ClientDto dto) {
        return clientService.updateClient(id, dto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable long id) {
        clientService.deleteClient(id);
    }
    
}
