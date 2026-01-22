# Script automatisé pour corriger toutes les erreurs et démarrer le backend
Write-Host "🔧 CORRECTION AUTOMATIQUE ET DÉMARRAGE BACKEND" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

$backendPath = "Ega backend/Ega-backend"
$srcPath = "$backendPath/src/main/java/com/example/Ega/backend"

Write-Host "`n📝 Correction de tous les fichiers Java..." -ForegroundColor Yellow

# 1. Corriger CompteController
Write-Host "   🔧 CompteController..." -ForegroundColor Green
$compteControllerPath = "$srcPath/controller/CompteController.java"
$content = @"
package com.example.Ega.backend.controller;

import com.example.Ega.backend.dto.CompteDTO;
import com.example.Ega.backend.service.CompteService;
import com.example.Ega.backend.util.SecurityUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comptes")
@CrossOrigin(origins = "http://localhost:4200")
public class CompteController {

    @Autowired
    private CompteService compteService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<CompteDTO> createCompte(@Valid @RequestBody CompteDTO compteDTO) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        if (currentClientId == null) {
            return ResponseEntity.badRequest().build();
        }
        compteDTO.setClientId(Long.parseLong(currentClientId));
        return ResponseEntity.ok(compteService.createCompte(compteDTO));
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<CompteDTO>> getComptesByCurrentClient() {
        String currentClientId = SecurityUtil.getCurrentClientId();
        if (currentClientId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(compteService.getComptesByClientId(Long.parseLong(currentClientId)));
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompteDTO>> getComptesByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(compteService.getComptesByClientId(clientId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @compteService.isCompteOwner(#id, authentication.name))")
    public ResponseEntity<CompteDTO> getCompteById(@PathVariable Long id) {
        return ResponseEntity.ok(compteService.getCompteById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        return ResponseEntity.ok(compteService.getAllComptes());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @compteService.isCompteOwner(#id, authentication.name))")
    public ResponseEntity<Void> deleteCompte(@PathVariable Long id) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        if (currentClientId == null) {
            return ResponseEntity.badRequest().build();
        }
        compteService.deleteCompte(id);
        return ResponseEntity.noContent().build();
    }
}
"@
Set-Content $compteControllerPath -Value $content -Encoding UTF8

# 2. Corriger CompteService
Write-Host "   🔧 CompteService..." -ForegroundColor Green
$compteServicePath = "$srcPath/service/CompteService.java"
$content = @"
package com.example.Ega.backend.service;

import com.example.Ega.backend.dto.CompteDTO;
import com.example.Ega.backend.entity.Client;
import com.example.Ega.backend.entity.Compte;
import com.example.Ega.backend.repository.ClientRepository;
import com.example.Ega.backend.repository.CompteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompteService {

    @Autowired
    private CompteRepository compteRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<CompteDTO> getComptesByClientId(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé avec l'ID: " + clientId));
        
        return compteRepository.findByClient(client).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CompteDTO createCompte(CompteDTO compteDTO) {
        Client client = clientRepository.findById(compteDTO.getClientId())
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        if (compteRepository.existsByNumeroCompte(compteDTO.getNumeroCompte())) {
            throw new RuntimeException("Le numéro de compte existe déjà");
        }

        Compte compte = new Compte();
        compte.setNumeroCompte(compteDTO.getNumeroCompte());
        compte.setTypeCompte(compteDTO.getTypeCompte());
        compte.setDateCreation(LocalDate.now());
        compte.setSolde(compteDTO.getSolde() != null ? compteDTO.getSolde() : BigDecimal.ZERO);
        compte.setClient(client);

        compte = compteRepository.save(compte);
        return toDTO(compte);
    }

    public CompteDTO getCompteById(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        return toDTO(compte);
    }

    public CompteDTO getCompteByNumero(String numeroCompte) {
        Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec le numéro: " + numeroCompte));
        return toDTO(compte);
    }

    public List<CompteDTO> getAllComptes() {
        return compteRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public boolean isCompteOwner(Long compteId, String username) {
        try {
            Compte compte = compteRepository.findById(compteId).orElse(null);
            return compte != null && compte.getClient() != null;
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public void deleteCompte(Long id) {
        Compte compte = compteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + id));
        
        compteRepository.deleteById(id);
    }

    private CompteDTO toDTO(Compte compte) {
        CompteDTO dto = new CompteDTO();
        dto.setId(compte.getId());
        dto.setNumeroCompte(compte.getNumeroCompte());
        dto.setTypeCompte(compte.getTypeCompte());
        dto.setDateCreation(compte.getDateCreation());
        dto.setSolde(compte.getSolde());
        dto.setClientId(compte.getClient().getId());
        dto.setClientNom(compte.getClient().getNom());
        dto.setClientPrenom(compte.getClient().getPrenom());
        return dto;
    }
}
"@
Set-Content $compteServicePath -Value $content -Encoding UTF8

# 3. Corriger TransactionController
Write-Host "   🔧 TransactionController..." -ForegroundColor Green
$transactionControllerPath = "$srcPath/controller/TransactionController.java"
$content = @"
package com.example.Ega.backend.controller;

import com.example.Ega.backend.dto.OperationRequest;
import com.example.Ega.backend.dto.TransactionDTO;
import com.example.Ega.backend.dto.VirementRequest;
import com.example.Ega.backend.service.TransactionService;
import com.example.Ega.backend.util.SecurityUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/depot")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<TransactionDTO> effectuerDepot(@Valid @RequestBody OperationRequest request) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        return ResponseEntity.ok(transactionService.effectuerDepot(request));
    }

    @PostMapping("/retrait")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<TransactionDTO> effectuerRetrait(@Valid @RequestBody OperationRequest request) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        return ResponseEntity.ok(transactionService.effectuerRetrait(request));
    }

    @PostMapping("/virement")
    @PreAuthorize("hasRole('CLIENT') or hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDTO>> effectuerVirement(@Valid @RequestBody VirementRequest request) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        return ResponseEntity.ok(transactionService.effectuerVirement(request));
    }

    @GetMapping("/compte/{compteId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CLIENT') and @compteService.isCompteOwner(#compteId, authentication.name))")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCompte(@PathVariable Long compteId) {
        String currentClientId = SecurityUtil.getCurrentClientId();
        return ResponseEntity.ok(transactionService.getTransactionsByCompteId(compteId));
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByCurrentClient() {
        String currentClientId = SecurityUtil.getCurrentClientId();
        return ResponseEntity.ok(transactionService.getTransactionsByClientId(Long.parseLong(currentClientId)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
}
"@
Set-Content $transactionControllerPath -Value $content -Encoding UTF8

# 4. Corriger TransactionService
Write-Host "   🔧 TransactionService..." -ForegroundColor Green
$transactionServicePath = "$srcPath/service/TransactionService.java"
$content = Get-Content $transactionServicePath -Raw
$content = $content -replace 'getTransactionsByCompteId\(String compteId\)', 'getTransactionsByCompteId(Long compteId)'
$content = $content -replace 'getTransactionsByClientId\(String clientId\)', 'getTransactionsByClientId(Long clientId)'
Set-Content $transactionServicePath -Value $content -Encoding UTF8

Write-Host "`n🔨 Compilation et démarrage..." -ForegroundColor Yellow

Set-Location $backendPath
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"

# Nettoyer
Write-Host "   🧹 Nettoyage..." -ForegroundColor Gray
& ./mvnw clean -q

# Compiler
Write-Host "   📦 Compilation..." -ForegroundColor Gray
$compileResult = & ./mvnw compile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Compilation réussie!" -ForegroundColor Green
    
    Write-Host "`n🚀 DÉMARRAGE DU BACKEND..." -ForegroundColor Cyan
    Write-Host "   Port: 8080" -ForegroundColor White
    Write-Host "   Base: MySQL ega_bank" -ForegroundColor White
    Write-Host "   URL: http://localhost:8080" -ForegroundColor White
    
    # Démarrer l'application
    & ./mvnw spring-boot:run
    
} else {
    Write-Host "   ❌ Erreurs de compilation restantes:" -ForegroundColor Red
    $compileResult | Where-Object { $_ -match "ERROR" } | Select-Object -First 10 | ForEach-Object {
        Write-Host "      $_" -ForegroundColor Red
    }
}

Set-Location "../.."