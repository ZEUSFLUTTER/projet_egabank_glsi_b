package com.ega.backend.service;

import com.ega.backend.model.Transaction;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    public byte[] generateTransactionPdf(List<Transaction> transactions) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Historique des Transactions")
                .setFontSize(20));

        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1}));
        table.addHeaderCell("Date");
        table.addHeaderCell("Type");
        table.addHeaderCell("Montant");
        table.addHeaderCell("Description");

        for (Transaction t : transactions) {
            table.addCell(t.getDate().toString());
            table.addCell(t.getType());
            table.addCell(t.getMontant().toString());
            table.addCell(t.getDescription());
        }

        document.add(table);
        document.close();

        return outputStream.toByteArray();
    }
}