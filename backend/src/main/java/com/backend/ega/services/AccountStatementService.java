package com.backend.ega.services;

import com.backend.ega.entities.Account;
import com.backend.ega.entities.Client;
import com.backend.ega.entities.Transaction;
import com.backend.ega.repositories.AccountsRepository;
import com.backend.ega.repositories.TransactionsRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Service pour générer des relevés de compte au format PDF
 * Utilise iText7 pour créer des documents PDF professionnels
 */
@Service
public class AccountStatementService {

    private final AccountsRepository accountsRepository;
    private final TransactionsRepository transactionsRepository;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter DATE_ONLY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public AccountStatementService(AccountsRepository accountsRepository, 
            TransactionsRepository transactionsRepository) {
        this.accountsRepository = accountsRepository;
        this.transactionsRepository = transactionsRepository;
    }

    /**
     * Génère un relevé de compte PDF pour toutes les transactions
     * @param accountId ID du compte
     * @return PDF sous forme de tableau d'octets
     */
    public byte[] generateAccountStatement(Long accountId) throws Exception {
        Optional<Account> accountOpt = accountsRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            throw new IllegalArgumentException("Compte non trouvé");
        }
        
        Account account = accountOpt.get();
        List<Transaction> transactions = transactionsRepository.findByAccount(account);
        
        return generatePdf(account, transactions, null, null);
    }

    /**
     * Génère un relevé de compte PDF pour une période donnée
     * @param accountId ID du compte
     * @param startDate Date de début
     * @param endDate Date de fin
     * @return PDF sous forme de tableau d'octets
     */
    public byte[] generateAccountStatementForPeriod(Long accountId, 
                                                    LocalDateTime startDate, 
                                                    LocalDateTime endDate) throws Exception {
        Optional<Account> accountOpt = accountsRepository.findById(accountId);
        if (accountOpt.isEmpty()) {
            throw new IllegalArgumentException("Compte non trouvé");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La date de début doit être avant la date de fin");
        }
        
        Account account = accountOpt.get();
        List<Transaction> transactions = transactionsRepository.findByAccountAndDateBetween(
                account, startDate, endDate);
        
        return generatePdf(account, transactions, startDate, endDate);
    }

    /**
     * Génère le document PDF
     */
    private byte[] generatePdf(Account account, 
        List<Transaction> transactions,
        LocalDateTime startDate,
        LocalDateTime endDate) throws Exception {
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // En-tête du document
        Paragraph title = new Paragraph("RELEVÉ DE COMPTE BANCAIRE")
                .setFontSize(20)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
        document.add(title);

        Paragraph bankName = new Paragraph("Banque EGA")
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
        document.add(bankName);

        // Informations du client
        Client client = account.getOwner();
        document.add(new Paragraph("Informations du client").setBold().setFontSize(12));
        document.add(new Paragraph("Nom: " + client.getFirstName() + " " + client.getLastName()));
        document.add(new Paragraph("Email: " + client.getEmail()));
        if (client.getPhoneNumber() != null) {
            document.add(new Paragraph("Téléphone: " + client.getPhoneNumber()));
        }
        document.add(new Paragraph("\n"));

        // Informations du compte
        document.add(new Paragraph("Informations du compte").setBold().setFontSize(12));
        document.add(new Paragraph("Numéro de compte: " + account.getAccountNumber()));
        document.add(new Paragraph("Type de compte: " + account.getAccountType()));
        document.add(new Paragraph("Date de création: " + 
                (account.getCreationDate() != null ? account.getCreationDate().format(DATE_ONLY_FORMATTER) : "N/A")));
        document.add(new Paragraph("Solde actuel: " + String.format("%.2f", account.getBalance()) + " FCFA"));
        
        // Période du relevé
        if (startDate != null && endDate != null) {
            document.add(new Paragraph("Période: du " + startDate.format(DATE_FORMATTER) + 
                    " au " + endDate.format(DATE_FORMATTER)).setItalic());
        } else {
            document.add(new Paragraph("Période: Toutes les transactions").setItalic());
        }
        
        document.add(new Paragraph("\n"));

        // Tableau des transactions
        document.add(new Paragraph("Historique des transactions").setBold().setFontSize(12));
        
        if (transactions.isEmpty()) {
            document.add(new Paragraph("Aucune transaction pour cette période.").setItalic());
        } else {
            // Créer un tableau avec 5 colonnes
            float[] columnWidths = {15, 20, 35, 15, 15};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // En-têtes du tableau
            String[] headers = {"Date", "Type", "Description", "Montant", "Solde"};
            for (String header : headers) {
                Cell headerCell = new Cell()
                        .add(new Paragraph(header).setBold())
                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                        .setTextAlignment(TextAlignment.CENTER);
                table.addHeaderCell(headerCell);
            }

            // Calculer le solde progressif (du plus ancien au plus récent)
            double runningBalance = account.getBalance();
            
            // On inverse pour calculer depuis le solde actuel
            for (int i = transactions.size() - 1; i >= 0; i--) {
                Transaction t = transactions.get(i);
                
                // Calculer l'impact sur le solde avant cette transaction
                if (t.getSourceAccount().getId().equals(account.getId())) {
                    // C'était un débit (retrait ou transfert sortant)
                    runningBalance += t.getAmount();
                } else {
                    // C'était un crédit (transfert entrant)
                    runningBalance -= t.getAmount();
                }
            }
            
            // Maintenant afficher les transactions dans l'ordre chronologique
            for (Transaction t : transactions) {
                // Date
                table.addCell(new Cell().add(new Paragraph(
                        t.getTransactionDate().format(DATE_FORMATTER))));
                
                // Type
                String type = t.getTransactionType().toString();
                table.addCell(new Cell().add(new Paragraph(type)));
                
                // Description
                String description = t.getDescription() != null ? t.getDescription() : "-";
                if (t.getDestinationAccount() != null && 
                    !t.getDestinationAccount().getId().equals(account.getId())) {
                    description += " (vers " + t.getDestinationAccount().getAccountNumber() + ")";
                } else if (t.getDestinationAccount() != null) {
                    description += " (de " + t.getSourceAccount().getAccountNumber() + ")";
                }
                table.addCell(new Cell().add(new Paragraph(description)));
                
                // Montant (avec signe)
                String amount;
                if (t.getSourceAccount().getId().equals(account.getId())) {
                    // Débit
                    amount = "- " + String.format("%.2f", t.getAmount());
                    runningBalance -= t.getAmount();
                } else {
                    // Crédit
                    amount = "+ " + String.format("%.2f", t.getAmount());
                    runningBalance += t.getAmount();
                }
                table.addCell(new Cell().add(new Paragraph(amount))
                        .setTextAlignment(TextAlignment.RIGHT));
                
                // Solde après transaction
                table.addCell(new Cell().add(new Paragraph(String.format("%.2f", runningBalance)))
                        .setTextAlignment(TextAlignment.RIGHT));
            }

            document.add(table);
        }

        // Pied de page
        document.add(new Paragraph("\n\n"));
        document.add(new Paragraph("Document généré le " + 
                LocalDateTime.now().format(DATE_FORMATTER))
                .setFontSize(8)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER));
        
        document.add(new Paragraph("Banque EGA - Tous droits réservés")
                .setFontSize(8)
                .setItalic()
                .setTextAlignment(TextAlignment.CENTER));

        document.close();
        return baos.toByteArray();
    }
}
