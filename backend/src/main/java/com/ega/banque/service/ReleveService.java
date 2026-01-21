package com.ega.banque.service;

import com.ega.banque.entity.Compte;
import com.ega.banque.entity.Transaction;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReleveService {

    private final TransactionService transactionService;
    private final CompteService compteService;

    public ReleveService(TransactionService transactionService, CompteService compteService) {
        this.transactionService = transactionService;
        this.compteService = compteService;
    }

    public byte[] genererRelevePdf(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        Compte compte = compteService.findById(compteId);
        List<Transaction> transactions = transactionService.getTransactionsByCompteAndPeriode(
                compteId, dateDebut, dateFin);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);

        document.open();

        // Titre
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Paragraph title = new Paragraph("RELEVÉ DE COMPTE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Informations du compte
        Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
        document.add(new Paragraph("Numéro de compte: " + compte.getNumeroCompte(), infoFont));
        document.add(new Paragraph("Type de compte: " + compte.getTypeCompte(), infoFont));
        document.add(new Paragraph("Date de création: " + compte.getDateCreation(), infoFont));
        document.add(new Paragraph("Période: " + dateDebut.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) +
                " - " + dateFin.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), infoFont));
        document.add(new Paragraph(" "));

        // Tableau des transactions
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2, 2, 2, 2});

        // En-têtes
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        table.addCell(new PdfPCell(new Phrase("Date", headerFont)));
        table.addCell(new PdfPCell(new Phrase("Type", headerFont)));
        table.addCell(new PdfPCell(new Phrase("Montant", headerFont)));
        table.addCell(new PdfPCell(new Phrase("Description", headerFont)));

        // Données
        Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        for (Transaction transaction : transactions) {
            table.addCell(new PdfPCell(new Phrase(
                    transaction.getDateTransaction().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                    dataFont)));
            table.addCell(new PdfPCell(new Phrase(transaction.getTypeTransaction(), dataFont)));
            table.addCell(new PdfPCell(new Phrase(
                    String.format("%.2f", transaction.getMontant()) + " €", dataFont)));
            
            String description = "";
            if ("VIREMENT".equals(transaction.getTypeTransaction())) {
                if (transaction.getCompteSource().getId().equals(compteId)) {
                    description = "Vers " + transaction.getCompteDestination().getNumeroCompte();
                } else {
                    description = "Depuis " + transaction.getCompteSource().getNumeroCompte();
                }
            } else if ("DEPOT".equals(transaction.getTypeTransaction())) {
                description = "Dépôt";
            } else if ("RETRAIT".equals(transaction.getTypeTransaction())) {
                description = "Retrait";
            }
            table.addCell(new PdfPCell(new Phrase(description, dataFont)));
        }

        document.add(table);
        document.add(new Paragraph(" "));

        // Solde
        Font soldeFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Paragraph solde = new Paragraph("Solde actuel: " + String.format("%.2f", compte.getSolde()) + " €", soldeFont);
        solde.setAlignment(Element.ALIGN_RIGHT);
        document.add(solde);

        document.close();

        return baos.toByteArray();
    }
}
