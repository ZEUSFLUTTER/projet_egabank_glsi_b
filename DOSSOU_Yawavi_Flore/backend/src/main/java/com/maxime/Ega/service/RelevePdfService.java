package com.maxime.Ega.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.maxime.Ega.Exeption.ResourceNotFoundException;
import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.Client;
import com.maxime.Ega.entity.Transaction;
import com.maxime.Ega.enums.TransactionType;
import com.maxime.Ega.repository.AccountRepository;
import com.maxime.Ega.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RelevePdfService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public byte[] genererReleve(String accountNumber,
                                LocalDateTime debut,
                                LocalDateTime fin) throws Exception {

        // ===== Vérification compte =====
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null) {
            throw new ResourceNotFoundException("account not found");
        }

        Client client = account.getClient();

        // ===== Transactions =====
        List<Transaction> transactions =
                transactionRepository.findByAccount_AccountNumberAndTransactionDateBetween(
                        account.getAccountNumber(), debut, fin
                );

        // Tri chronologique (ancien -> récent)
        transactions.sort(Comparator.comparing(Transaction::getTransactionDate));

        // ===== Calcul du solde initial (avant la période) =====
        double soldeCourant = account.getBalance().doubleValue();

        for (Transaction t : transactions) {
            switch (t.getTransactionType()) {
                case DEPOT:
                case TRANSFERT_ENTRANT:
                    soldeCourant -= t.getAmount().doubleValue();
                    break;

                case RETRAIT:
                case TRANSFERT_SORTANT:
                    soldeCourant += t.getAmount().doubleValue();
                    break;
            }
        }

        // ===== PDF =====
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        document.add(new Paragraph("RELEVÉ BANCAIRE", titleFont));
        document.add(new Paragraph("Banque EGA"));
        document.add(new Paragraph("Date d'édition : " + LocalDate.now()));
        document.add(Chunk.NEWLINE);

        // ===== INFOS CLIENT =====
        document.add(new Paragraph("INFORMATIONS CLIENT"));
        document.add(new Paragraph("Nom : " + client.getLastName()));
        document.add(new Paragraph("Prénom : " + client.getFirstName()));
        document.add(new Paragraph("Email : " + client.getEmail()));
        document.add(new Paragraph("Téléphone : " + client.getPhoneNumber()));
        document.add(Chunk.NEWLINE);

        // ===== INFOS COMPTE =====
        document.add(new Paragraph("INFORMATIONS DU COMPTE"));
        document.add(new Paragraph("Numéro de compte : " + account.getAccountNumber()));
        document.add(new Paragraph("Type de compte : " + account.getAccountType()));
        document.add(new Paragraph("Date de création : " + account.getCreatedAt()));
        document.add(new Paragraph("Solde actuel : " + String.format("%,.2f FCFA", account.getBalance())));
        document.add(Chunk.NEWLINE);

        // ===== TABLEAU =====
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{2, 2, 3, 4});

        Font headFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        table.addCell(new Phrase("Date", headFont));
        table.addCell(new Phrase("Type", headFont));
        table.addCell(new Phrase("Montant", headFont));
        table.addCell(new Phrase("Solde après", headFont));

        // ===== Calcul et affichage correct =====
        for (Transaction t : transactions) {

            switch (t.getTransactionType()) {
                case DEPOT:
                case TRANSFERT_ENTRANT:
                    soldeCourant += t.getAmount().doubleValue();
                    break;

                case RETRAIT:
                case TRANSFERT_SORTANT:
                    soldeCourant -= t.getAmount().doubleValue();
                    break;
            }

            table.addCell(t.getTransactionDate().toLocalDate().toString());
            table.addCell(t.getTransactionType().toString());
            table.addCell(String.format("%,.2f FCFA", t.getAmount()));
            table.addCell(String.format("%,.2f FCFA", soldeCourant));
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }
}
