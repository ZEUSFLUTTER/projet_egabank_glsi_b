package com.banque.service.impl;

import com.banque.dto.TransactionDTO;
import com.banque.entity.Compte;
import com.banque.repository.CompteRepository;
import com.banque.service.ReleveService;
import com.banque.service.TransactionService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReleveServiceImpl implements ReleveService {
    
    private final CompteRepository compteRepository;
    private final TransactionService transactionService;
    
    @Override
    public byte[] generateRelevePdf(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        try {
            Compte compte = compteRepository.findById(compteId)
                    .orElseThrow(() -> new RuntimeException("Compte non trouvé avec l'ID: " + compteId));
            
            // Récupérer les transactions
            List<TransactionDTO> transactions;
            if (dateDebut != null || dateFin != null) {
                transactions = transactionService.getTransactionsByCompteAndPeriod(compteId, dateDebut, dateFin);
            } else {
                transactions = transactionService.getTransactionsByCompte(compteId);
            }
            
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Polices
PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
PdfFont fontBold = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

            
            // En-tête de la banque
            Paragraph bankHeader = new Paragraph("BANQUE EGA")
                    .setFont(fontBold)
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(5);
            document.add(bankHeader);
            
            Paragraph bankAddress = new Paragraph("123 Boulevard du 13 janvier, 75001 Lome, Togo\nTél: +228 99 78 44 79")
                    .setFont(font)
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(15);
            document.add(bankAddress);
            
            // Titre du relevé
            Paragraph title = new Paragraph("RELEVÉ DE COMPTE")
                    .setFont(fontBold)
                    .setFontSize(18)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);
            
            // Informations du compte dans un tableau
            Table accountTable = new Table(UnitValue.createPercentArray(new float[]{1, 1}))
                    .useAllAvailableWidth()
                    .setMarginBottom(15);
            
            // Ligne 1: Titulaire et Numéro de compte
            accountTable.addCell(new Cell().add(new Paragraph("Titulaire du compte:").setFont(fontBold).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph(compte.getClient().getPrenom() + " " + compte.getClient().getNom()).setFont(font).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph("Numéro de compte:").setFont(fontBold).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph(compte.getNumCompte()).setFont(font).setFontSize(10)));
            
            // Ligne 2: Type et Devise
            accountTable.addCell(new Cell().add(new Paragraph("Type de compte:").setFont(fontBold).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph(compte.getTypeCompte().toString()).setFont(font).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph("Devise:").setFont(fontBold).setFontSize(10)));
            accountTable.addCell(new Cell().add(new Paragraph("XOF").setFont(font).setFontSize(10)));
            
            document.add(accountTable);
            
            // Période du relevé
            String periodeText = "Période: ";
            if (dateDebut != null && dateFin != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                periodeText += "Du " + dateDebut.format(formatter) + " au " + dateFin.format(formatter);
            } else if (dateDebut != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                periodeText += "À partir du " + dateDebut.format(formatter);
            } else if (dateFin != null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                periodeText += "Jusqu'au " + dateFin.format(formatter);
            } else {
                periodeText += "Tous les mouvements";
            }
            
            Paragraph periode = new Paragraph(periodeText)
                    .setFont(font)
                    .setFontSize(10)
                    .setMarginBottom(15);
            document.add(periode);
            
            // Solde d'ouverture
            BigDecimal soldeOuverture = compte.getSolde();
            for (TransactionDTO t : transactions) {
                if (t.getTypeTransaction().name().equals("DEPOT")) {
                    soldeOuverture = soldeOuverture.subtract(t.getMontant());
                } else if (t.getTypeTransaction().name().equals("RETRAIT")) {
                    soldeOuverture = soldeOuverture.add(t.getMontant());
                } else if (t.getTypeTransaction().name().equals("TRANSFERT")) {
                    if (t.getCompteSourceId().equals(compteId)) {
                        soldeOuverture = soldeOuverture.add(t.getMontant());
                    } else {
                        soldeOuverture = soldeOuverture.subtract(t.getMontant());
                    }
                }
            }
            
            Paragraph soldeOuverturePara = new Paragraph("Solde d'ouverture: " + soldeOuverture + " FR")
                    .setFont(fontBold)
                    .setFontSize(11)
                    .setMarginBottom(10);
            document.add(soldeOuverturePara);
            
            // Table des transactions
            Table table = new Table(UnitValue.createPercentArray(new float[]{2, 4, 2, 2, 2}))
                    .useAllAvailableWidth()
                    .setMarginTop(10);
            
            // En-têtes du tableau
            table.addHeaderCell(new Cell().add(new Paragraph("Date").setFont(fontBold).setFontSize(9)).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell().add(new Paragraph("Description").setFont(fontBold).setFontSize(9)).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell().add(new Paragraph("Débit").setFont(fontBold).setFontSize(9)).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell().add(new Paragraph("Crédit").setFont(fontBold).setFontSize(9)).setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell().add(new Paragraph("Solde").setFont(fontBold).setFontSize(9)).setTextAlignment(TextAlignment.CENTER));
            
            // Calculer le solde après chaque transaction
            BigDecimal soldeCourant = soldeOuverture;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            
            for (TransactionDTO t : transactions) {
                // Calculer débit et crédit
                String debit = "";
                String credit = "";
                String description = t.getDescription() != null ? t.getDescription() : t.getTypeTransaction().name();
                
                if (t.getTypeTransaction().name().equals("DEPOT") || 
                    (t.getTypeTransaction().name().equals("TRANSFERT") && t.getCompteDestinationId().equals(compteId))) {
                    credit = t.getMontant().toString();
                    soldeCourant = soldeCourant.add(t.getMontant());
                } else if (t.getTypeTransaction().name().equals("RETRAIT") || 
                          (t.getTypeTransaction().name().equals("TRANSFERT") && t.getCompteSourceId().equals(compteId))) {
                    debit = t.getMontant().toString();
                    soldeCourant = soldeCourant.subtract(t.getMontant());
                }
                
                // Ajouter la ligne
                table.addCell(new Cell().add(new Paragraph(t.getDateTransaction().format(dateFormatter)).setFont(font).setFontSize(8)));
                table.addCell(new Cell().add(new Paragraph(description).setFont(font).setFontSize(8)));
                table.addCell(new Cell().add(new Paragraph(debit).setFont(font).setFontSize(8)).setTextAlignment(TextAlignment.RIGHT));
                table.addCell(new Cell().add(new Paragraph(credit).setFont(font).setFontSize(8)).setTextAlignment(TextAlignment.RIGHT));
                table.addCell(new Cell().add(new Paragraph(soldeCourant.toString()).setFont(font).setFontSize(8)).setTextAlignment(TextAlignment.RIGHT));
            }
            
            document.add(table);
            
            // Solde de clôture
            document.add(new Paragraph("\n"));
            Paragraph soldeCloture = new Paragraph("Solde de clôture: " + compte.getSolde() + " FR")
                    .setFont(fontBold)
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(20);
            document.add(soldeCloture);
            
            // Pied de page
            document.add(new Paragraph("\n"));
            Paragraph footer = new Paragraph("Ce relevé est généré automatiquement et fait office de document officiel.\n" +
                    "Pour toute question, contactez notre service client au +228 70 40 58 63 ou par email à egabank@ega.com")
                    .setFont(font)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(20);
            document.add(footer);
            
            // Date d'édition
            Paragraph dateEdition = new Paragraph("Relevé généré le: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy à HH:mm")))
                    .setFont(font)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(10);
            document.add(dateEdition);
            
            document.close();
            
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du relevé: " + e.getMessage(), e);
        }
    }
}


