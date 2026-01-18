package com.ega.banking.service;

import com.ega.banking.dto.TransactionDTO;
import com.ega.banking.exception.ResourceNotFoundException;
import com.ega.banking.model.Compte;
import com.ega.banking.repository.CompteRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RelevePdfService {

        private final CompteRepository compteRepository;
        private final ReleveService releveService;

        private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        private static final DateTimeFormatter PERIOD_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        private static final DeviceRgb HEADER_COLOR = new DeviceRgb(33, 33, 33);
        private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(245, 245, 245);

        public byte[] genererRelevePdf(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin) {
                log.info("Génération du relevé PDF pour le compte ID={} du {} au {}",
                                compteId, dateDebut, dateFin);

                Compte compte = compteRepository.findById(compteId)
                                .orElseThrow(() -> new ResourceNotFoundException("Compte", "id", compteId));

                List<TransactionDTO> transactions = releveService.genererReleve(compteId, dateDebut, dateFin);

                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf);

                        // En-tête
                        addHeader(document, compte, dateDebut, dateFin);

                        // Résumé du compte
                        addAccountSummary(document, compte, transactions);

                        // Tableau des transactions
                        addTransactionsTable(document, transactions);

                        // Pied de page
                        addFooter(document);

                        document.close();

                        log.info("Relevé PDF généré avec succès ({} transactions)", transactions.size());
                        return baos.toByteArray();

                } catch (Exception e) {
                        log.error("Erreur lors de la génération du PDF", e);
                        throw new RuntimeException("Erreur lors de la génération du relevé PDF: " + e.getMessage());
                }
        }

        public byte[] genererReleveMensuelPdf(Long compteId, int annee, int mois) {
                LocalDateTime dateDebut = LocalDateTime.of(annee, mois, 1, 0, 0);
                LocalDateTime dateFin = dateDebut.plusMonths(1).minusSeconds(1);
                return genererRelevePdf(compteId, dateDebut, dateFin);
        }

        public byte[] genererReleveAnnuelPdf(Long compteId, int annee) {
                LocalDateTime dateDebut = LocalDateTime.of(annee, 1, 1, 0, 0);
                LocalDateTime dateFin = LocalDateTime.of(annee, 12, 31, 23, 59, 59);
                return genererRelevePdf(compteId, dateDebut, dateFin);
        }

        private void addHeader(Document document, Compte compte, LocalDateTime dateDebut, LocalDateTime dateFin) {
                // Logo/Titre de la banque
                Paragraph title = new Paragraph("EGA BANK")
                                .setFontSize(24)
                                .setBold()
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFontColor(HEADER_COLOR);
                document.add(title);

                Paragraph subtitle = new Paragraph("Relevé de Compte Bancaire")
                                .setFontSize(14)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFontColor(ColorConstants.GRAY);
                document.add(subtitle);

                // Période du relevé
                Paragraph period = new Paragraph(
                                String.format("Période: du %s au %s",
                                                dateDebut.format(PERIOD_FORMATTER),
                                                dateFin.format(PERIOD_FORMATTER)))
                                .setFontSize(11)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setMarginTop(5)
                                .setMarginBottom(20);
                document.add(period);

                // Informations du compte
                Table infoTable = new Table(new float[] { 1, 1 });
                infoTable.setWidth(UnitValue.createPercentValue(100));

                addInfoCell(infoTable, "Titulaire:", compte.getClient().getNomComplet());
                addInfoCell(infoTable, "IBAN:", compte.getNumeroCompte());
                addInfoCell(infoTable, "Type de compte:", compte.getType().toString());
                addInfoCell(infoTable, "Date d'ouverture:", compte.getDateCreation().format(PERIOD_FORMATTER));

                document.add(infoTable);
                document.add(new Paragraph("\n"));
        }

        private void addInfoCell(Table table, String label, String value) {
                table.addCell(new Cell().add(new Paragraph(label).setBold().setFontSize(10))
                                .setBorder(null)
                                .setPadding(3));
                table.addCell(new Cell().add(new Paragraph(value).setFontSize(10))
                                .setBorder(null)
                                .setPadding(3));
        }

        private void addAccountSummary(Document document, Compte compte, List<TransactionDTO> transactions) {
                // Calcul des totaux
                BigDecimal totalDepots = transactions.stream()
                                .filter(t -> "DEPOT".equals(t.getTypeTransaction().toString()))
                                .map(TransactionDTO::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalRetraits = transactions.stream()
                                .filter(t -> "RETRAIT".equals(t.getTypeTransaction().toString()))
                                .map(TransactionDTO::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalVirementsEmis = transactions.stream()
                                .filter(t -> "VIREMENT".equals(t.getTypeTransaction().toString()) &&
                                                t.getCompteSourceId() != null
                                                && t.getCompteSourceId().equals(compte.getId()))
                                .map(TransactionDTO::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalVirementsRecus = transactions.stream()
                                .filter(t -> "VIREMENT".equals(t.getTypeTransaction().toString()) &&
                                                t.getCompteDestinationId() != null
                                                && t.getCompteDestinationId().equals(compte.getId()))
                                .map(TransactionDTO::getMontant)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Table de résumé
                Paragraph summaryTitle = new Paragraph("Résumé")
                                .setBold()
                                .setFontSize(12)
                                .setMarginTop(10);
                document.add(summaryTitle);

                Table summaryTable = new Table(new float[] { 3, 1 });
                summaryTable.setWidth(UnitValue.createPercentValue(50));

                addSummaryRow(summaryTable, "Solde actuel:", formatMontant(compte.getSolde()) + " FCFA");
                addSummaryRow(summaryTable, "Total des dépôts:", "+" + formatMontant(totalDepots) + " FCFA");
                addSummaryRow(summaryTable, "Total des retraits:", "-" + formatMontant(totalRetraits) + " FCFA");
                addSummaryRow(summaryTable, "Virements émis:", "-" + formatMontant(totalVirementsEmis) + " FCFA");
                addSummaryRow(summaryTable, "Virements reçus:", "+" + formatMontant(totalVirementsRecus) + " FCFA");
                addSummaryRow(summaryTable, "Nombre d'opérations:", String.valueOf(transactions.size()));

                document.add(summaryTable);
                document.add(new Paragraph("\n"));
        }

        private void addSummaryRow(Table table, String label, String value) {
                table.addCell(new Cell().add(new Paragraph(label).setFontSize(9))
                                .setBorder(null)
                                .setBackgroundColor(LIGHT_GRAY)
                                .setPadding(5));
                table.addCell(new Cell().add(new Paragraph(value).setFontSize(9).setBold())
                                .setBorder(null)
                                .setBackgroundColor(LIGHT_GRAY)
                                .setPadding(5)
                                .setTextAlignment(TextAlignment.RIGHT));
        }

        private void addTransactionsTable(Document document, List<TransactionDTO> transactions) {
                Paragraph tableTitle = new Paragraph("Détail des opérations")
                                .setBold()
                                .setFontSize(12)
                                .setMarginTop(15);
                document.add(tableTitle);

                if (transactions.isEmpty()) {
                        document.add(new Paragraph("Aucune transaction pour cette période.")
                                        .setItalic()
                                        .setFontColor(ColorConstants.GRAY));
                        return;
                }

                // Table des transactions
                Table table = new Table(new float[] { 2, 4, 2, 2 });
                table.setWidth(UnitValue.createPercentValue(100));
                table.setMarginTop(10);

                // En-têtes
                addTableHeader(table, "Date");
                addTableHeader(table, "Description");
                addTableHeader(table, "Type");
                addTableHeader(table, "Montant");

                // Lignes de données
                boolean alternate = false;
                for (TransactionDTO transaction : transactions) {
                        DeviceRgb bgColor = alternate ? LIGHT_GRAY : new DeviceRgb(255, 255, 255);

                        addTableCell(table, transaction.getDateTransaction().format(DATE_FORMATTER), bgColor,
                                        TextAlignment.LEFT);
                        addTableCell(table, transaction.getDescription(), bgColor, TextAlignment.LEFT);
                        addTableCell(table, transaction.getTypeTransaction().toString(), bgColor, TextAlignment.CENTER);

                        String montantStr = formatMontant(transaction.getMontant()) + " FCFA";
                        if ("DEPOT".equals(transaction.getTypeTransaction().toString())) {
                                montantStr = "+" + montantStr;
                        } else if ("RETRAIT".equals(transaction.getTypeTransaction().toString()) ||
                                        "VIREMENT".equals(transaction.getTypeTransaction().toString())) {
                                montantStr = "-" + montantStr;
                        }
                        addTableCell(table, montantStr, bgColor, TextAlignment.RIGHT);

                        alternate = !alternate;
                }

                document.add(table);
        }

        private void addTableHeader(Table table, String text) {
                Cell cell = new Cell()
                                .add(new Paragraph(text).setBold().setFontSize(9).setFontColor(ColorConstants.WHITE))
                                .setBackgroundColor(HEADER_COLOR)
                                .setPadding(8)
                                .setTextAlignment(TextAlignment.CENTER);
                table.addHeaderCell(cell);
        }

        private void addTableCell(Table table, String text, DeviceRgb bgColor, TextAlignment alignment) {
                Cell cell = new Cell()
                                .add(new Paragraph(text != null ? text : "").setFontSize(8))
                                .setBackgroundColor(bgColor)
                                .setPadding(5)
                                .setTextAlignment(alignment);
                table.addCell(cell);
        }

        private void addFooter(Document document) {
                document.add(new Paragraph("\n"));

                Paragraph footer = new Paragraph(
                                String.format("Document généré le %s - EGA Bank © %d",
                                                LocalDateTime.now().format(DATE_FORMATTER),
                                                LocalDateTime.now().getYear()))
                                .setFontSize(8)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFontColor(ColorConstants.GRAY)
                                .setMarginTop(30);
                document.add(footer);

                Paragraph disclaimer = new Paragraph(
                                "Ce document est un relevé officiel. Conservez-le pour vos archives.")
                                .setFontSize(7)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFontColor(ColorConstants.GRAY)
                                .setItalic();
                document.add(disclaimer);
        }

        private String formatMontant(BigDecimal montant) {
                if (montant == null)
                        return "0";
                return String.format("%,.0f", montant);
        }
}
