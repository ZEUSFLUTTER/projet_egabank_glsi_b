package com.ega.ega_bank.service;

import com.ega.ega_bank.entite.Transaction;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    public byte[] generateHistoriquePdf(List<Transaction> transactions) throws Exception {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        // --- Titre principal ---
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
        Paragraph title = new Paragraph("Historique des Transactions", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" ")); // espace

        // --- Tableau des transactions ---
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        table.addCell("Date");
        table.addCell("Type");
        table.addCell("Montant");
        table.addCell("Source");
        table.addCell("Destination");

        for (Transaction t : transactions) {
            table.addCell(t.getDateOperation().toString());
            table.addCell(t.getType().name());
            table.addCell(t.getMontant().toPlainString() + " FCFA");
            table.addCell(t.getCompteSource() != null ? t.getCompteSource().getNumeroCompte() : "-");
            table.addCell(t.getCompteDestination() != null ? t.getCompteDestination().getNumeroCompte() : "-");
        }

        document.add(table);

        document.add(new Paragraph("Nombre total de transactions : " + transactions.size()));

        document.close();
        return out.toByteArray();
    }
}
