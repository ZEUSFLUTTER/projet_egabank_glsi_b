/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.service.CompteService;
import com.egabank.Backend.service.ReleveService;
import com.egabank.Backend.service.TransactionService;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
/**
 *
 * @author HP
 */
@Service
public class ReleveServiceImpl implements ReleveService {
    private final CompteService serviceComptes;
    private final TransactionService serviceTransactions;

    public ReleveServiceImpl(CompteService serviceComptes, TransactionService serviceTransactions) {
        this.serviceComptes = serviceComptes;
        this.serviceTransactions = serviceTransactions;
    }

    @Override
    public byte[] genererRelevePdf(String numeroCompte, LocalDate dateDebut, LocalDate dateFin) {
        Compte compte = serviceComptes.consulter(numeroCompte);
        List<Transaction> transactions = serviceTransactions.listerParPeriode(numeroCompte, dateDebut, dateFin);

        try (ByteArrayOutputStream sortie = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, sortie);
            document.open();

            Font titre = new Font(FontFactory.getFont(FontFactory.HELVETICA).getBaseFont(), 16, Font.BOLD);
            Font normal = new Font(FontFactory.getFont(FontFactory.HELVETICA).getBaseFont(), 11, Font.NORMAL);

            document.add(new Paragraph("Relevé de compte", titre));
            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("Numero de compte : " + compte.getNumeroCompte(), normal));
            document.add(new Paragraph("Type : " + compte.getTypeCompte(), normal));
            document.add(new Paragraph("Propriétaire : " + compte.getProprietaire().getNom() + " " + compte.getProprietaire().getPrenom(), normal));
            document.add(new Paragraph("Période : " + dateDebut + " au " + dateFin, normal));
            document.add(new Paragraph("Solde actuel : " + compte.getSolde(), normal));
            document.add(Chunk.NEWLINE);

            PdfPTable tableau = new PdfPTable(5);
            tableau.setWidthPercentage(100);
            tableau.addCell("Date");
            tableau.addCell("Type");
            tableau.addCell("Libellé");
            tableau.addCell("Montant");
            tableau.addCell("Détails");

            for (Transaction t : transactions) {
                tableau.addCell(t.getDateOperation().toString());
                tableau.addCell(t.getTypeTransaction().toString());
                tableau.addCell(t.getLibelle());
                tableau.addCell(String.valueOf(t.getMontant()));
                String details = (t.getCompteDestination() != null) ? ("Vers: " + t.getCompteDestination().getNumeroCompte()) : "-";
                tableau.addCell(details);
            }

            document.add(tableau);
            document.close();
            return sortie.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF.");
        }
    }
}
