package com.ega.service;

import com.ega.dto.TransactionDTO;
import com.ega.exception.ResourceNotFoundException;
import com.ega.model.Compte;
import com.ega.repository.CompteRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ReleveService {

    private final CompteRepository compteRepository;
    private final TransactionService transactionService;

    public byte[] generateRelevePdf(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
        // Vérifier que le compte existe
        Compte compte = compteRepository.findById(compteId)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé avec l'ID: " + compteId));

        // Récupérer les transactions
        List<TransactionDTO> transactions = transactionService.getTransactionsByCompteIdAndPeriod(compteId, dateDebut, dateFin);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            // En-tête
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Paragraph title = new Paragraph("RELEVE BANCAIRE - BANQUE EGA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Infos du compte
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            document.add(new Paragraph("Numéro de compte: " + compte.getNumeroCompte(), infoFont));
            document.add(new Paragraph("Type de compte: " + compte.getTypeCompte().name(), infoFont));
            document.add(new Paragraph("Client: " + compte.getClient().getNom() + " " + compte.getClient().getPrenom(), infoFont));
            document.add(new Paragraph("Période: du " + formatDate(dateDebut) + " au " + formatDate(dateFin), infoFont));
            document.add(new Paragraph("Solde actuel: " + compte.getSolde() + " FCFA", infoFont));
            document.add(new Paragraph(" "));

            // Table des transactions
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new int[]{2, 3, 2, 2, 3});

            // En-têtes de colonnes
            Stream.of("Date", "Type", "Montant", "Solde", "Description")
                    .forEach(col -> {
                        PdfPCell header = new PdfPCell();
                        header.setBackgroundColor(Color.LIGHT_GRAY);
                        header.setBorderWidth(1);
                        header.setPhrase(new Phrase(col, FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
                        header.setHorizontalAlignment(Element.ALIGN_CENTER);
                        table.addCell(header);
                    });

            // Calcul du solde initial
            BigDecimal soldeInitial = compte.getSolde();
            for (TransactionDTO t : transactions) {
                if (t.getTypeTransaction().name().equals("DEPOT") || t.getTypeTransaction().name().equals("VIREMENT_ENTRANT")) {
                    soldeInitial = soldeInitial.subtract(t.getMontant());
                } else {
                    soldeInitial = soldeInitial.add(t.getMontant());
                }
            }

            BigDecimal soldeCalcul = soldeInitial;

            // Ajouter transactions
            for (int i = transactions.size() - 1; i >= 0; i--) {
                TransactionDTO t = transactions.get(i);

                if (t.getTypeTransaction().name().equals("DEPOT") || t.getTypeTransaction().name().equals("VIREMENT_ENTRANT")) {
                    soldeCalcul = soldeCalcul.add(t.getMontant());
                } else {
                    soldeCalcul = soldeCalcul.subtract(t.getMontant());
                }

                table.addCell(new PdfPCell(new Phrase(formatDate(t.getDateTransaction()), FontFactory.getFont(FontFactory.HELVETICA))));
                table.addCell(new PdfPCell(new Phrase(t.getTypeTransaction().name(), FontFactory.getFont(FontFactory.HELVETICA))));
                
                Color montantColor = (t.getTypeTransaction().name().equals("DEPOT") || t.getTypeTransaction().name().equals("VIREMENT_ENTRANT"))
                        ? Color.GREEN : Color.RED;
                table.addCell(new PdfPCell(new Phrase(t.getMontant() + " FCFA", FontFactory.getFont(FontFactory.HELVETICA, 10, montantColor))));
                
                table.addCell(new PdfPCell(new Phrase(soldeCalcul + " FCFA", FontFactory.getFont(FontFactory.HELVETICA))));
                table.addCell(new PdfPCell(new Phrase(t.getDescription() != null ? t.getDescription() : "", FontFactory.getFont(FontFactory.HELVETICA, 9))));
            }

            document.add(table);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Solde initial: " + soldeInitial + " FCFA", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
            document.add(new Paragraph("Solde final: " + compte.getSolde() + " FCFA", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));

            document.close();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du relevé PDF", e);
        }

        return baos.toByteArray();
    }

    private String formatDate(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
