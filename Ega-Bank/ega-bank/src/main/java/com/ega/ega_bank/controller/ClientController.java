package com.ega.ega_bank.controller;

import com.ega.ega_bank.entite.Client;
import com.ega.ega_bank.dto.ClientRequest;
import com.ega.ega_bank.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService service;

    // --- Constructeur manuel (remplace @RequiredArgsConstructor) ---
    public ClientController(ClientService service) {
        this.service = service;
    }

    @PostMapping
    public Client create(@Valid @RequestBody ClientRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<Client> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Client get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public Client update(@PathVariable Long id, @Valid @RequestBody ClientRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
