package com.ega.ega_bank.controller;

import com.ega.ega_bank.entite.Transaction;
import com.ega.ega_bank.service.TransactionService;
import com.ega.ega_bank.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final PdfService pdfService;

    public TransactionController(TransactionService transactionService, PdfService pdfService) {
        this.transactionService = transactionService;
        this.pdfService = pdfService;
    }

    // Transactions récentes (pour le dashboard admin)
    @GetMapping("/recent")
    public List<Transaction> transactionsRecentes() {
        return transactionService.getTransactionsRecentes(10); // Dernières 10 transactions
    }

    // Historique d'un client en JSON
    @GetMapping("/client/{clientId}")
    public List<Transaction> historiqueClient(@PathVariable Long clientId) {
        return transactionService.historiqueClient(clientId);
    }

    // Historique d'un client en PDF
    @GetMapping("/client/{clientId}/pdf")
    public ResponseEntity<byte[]> historiqueClientPdf(@PathVariable Long clientId) throws Exception {
        List<Transaction> transactions = transactionService.historiqueClient(clientId);
        byte[] pdf = pdfService.generateHistoriquePdf(transactions);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=historique.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}