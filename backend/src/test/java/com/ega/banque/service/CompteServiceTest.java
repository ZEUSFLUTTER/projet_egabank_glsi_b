package com.ega.banque.service;

import com.ega.banque.entity.Client;
import com.ega.banque.entity.Compte;
import com.ega.banque.entity.TypeCompte;
import com.ega.banque.repository.ClientRepository;
import com.ega.banque.repository.CompteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class CompteServiceTest {

    @Mock
    private CompteRepository compteRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private CompteService compteService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreerCompte() {
        Long clientId = 1L;
        TypeCompte typeCompte = TypeCompte.EPARGNE;
        Client client = new Client();
        client.setId(clientId);

        when(clientRepository.findById(clientId)).thenReturn(Optional.of(client));
        when(compteRepository.save(any(Compte.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Compte createdCompte = compteService.creerCompte(clientId, typeCompte);

        assertNotNull(createdCompte);
        assertEquals(typeCompte, createdCompte.getTypeCompte());
        assertEquals(BigDecimal.ZERO, createdCompte.getSolde());
        assertNotNull(createdCompte.getNumeroCompte());
    }

    @Test
    void testCreerCompteClientInexistant() {
        Long clientId = 99L;
        when(clientRepository.findById(clientId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> compteService.creerCompte(clientId, TypeCompte.COURANT));
    }
}
