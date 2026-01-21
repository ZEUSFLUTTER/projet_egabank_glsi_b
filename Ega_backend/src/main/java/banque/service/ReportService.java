package banque.service;

import banque.entity.Client;
import banque.entity.Compte;
import banque.entity.Transaction;
import banque.enums.TypeTransaction;
import banque.repository.TransactionRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.iban4j.Iban;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CompteService compteService;
    private final TransactionRepository transactionRepository;

    // --- PALETTE DE COULEURS ---
    // #530062 (Foncé - Textes principaux / Bordures)
    private static final Color COLOR_PRIMARY = new Color(83, 0, 98);
    // #8A3399 (Moyen - En-têtes de tableaux)
    private static final Color COLOR_SECONDARY = new Color(138, 51, 153);
    // #CC00FF (Vif - Accents / Titres)
    private static final Color COLOR_ACCENT = new Color(204, 0, 255);
    // #FDEFFF (Très clair - Fond alterné des tableaux)
    private static final Color COLOR_BACKGROUND_LIGHT = new Color(253, 239, 255);
    // Blanc pour le texte sur fond foncé
    private static final Color COLOR_WHITE = Color.WHITE;

    // --- POLICES ---
    private static final Font FONT_TITRE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, COLOR_PRIMARY);
    private static final Font FONT_SOUS_TITRE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, COLOR_SECONDARY);
    private static final Font FONT_NORMAL = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.BLACK);
    private static final Font FONT_BOLD = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, COLOR_PRIMARY);
    private static final Font FONT_HEADER_TABLE = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, COLOR_WHITE);
    private static final Font FONT_FOOTER = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, COLOR_SECONDARY);

    /**
     * 1. GÉNÉRER UN RIB (PDF)
     */
    public byte[] genererRibPdf(String numeroCompte) {
        Compte compte = compteService.getCompteByNumero(numeroCompte);
        Client client = compte.getClient();
        Iban ibanInfo = Iban.valueOf(compte.getNumeroCompte());
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();

            // 1. Logo & En-tête
            ajouterLogoEtEntete(document);

            // 2. Titre stylisé
            ajouterTitre(document, "RELEVÉ D'IDENTITÉ BANCAIRE");

            // 3. Cadre Informations Client
            PdfPTable infoTable = new PdfPTable(1);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20);

            PdfPCell cellInfo = new PdfPCell();
            cellInfo.setBorderColor(COLOR_SECONDARY);
            cellInfo.setPadding(15);
            cellInfo.setBackgroundColor(COLOR_BACKGROUND_LIGHT);

            cellInfo.addElement(new Paragraph("TITULAIRE DU COMPTE", FONT_SOUS_TITRE));
            cellInfo.addElement(new Paragraph(client.getNom().toUpperCase() + " " + client.getPrenom(), FONT_BOLD));
            cellInfo.addElement(new Paragraph(client.getAdresse(), FONT_NORMAL));

            infoTable.addCell(cellInfo);
            document.add(infoTable);

            // 4. Tableau RIB
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2, 2, 4, 1, 3});
            table.setSpacingBefore(10f);

            // En-têtes
            ajouterHeaderCell(table, "Code Banque");
            ajouterHeaderCell(table, "Code Guichet");
            ajouterHeaderCell(table, "N° Compte");
            ajouterHeaderCell(table, "Clé");
            ajouterHeaderCell(table, "Domiciliation");

            // Données
            ajouterCelluleDonnee(table, ibanInfo.getBankCode(), false);
            ajouterCelluleDonnee(table, ibanInfo.getBranchCode(), false);
            ajouterCelluleDonnee(table, ibanInfo.getAccountNumber(), false);
            ajouterCelluleDonnee(table, ibanInfo.getNationalCheckDigit(), false);
            ajouterCelluleDonnee(table, "EGA LOMÉ", false);

            document.add(table);

            // 5. IBAN
            Paragraph pIban = new Paragraph("\nIBAN : " + ibanInfo.toFormattedString(), FONT_SOUS_TITRE);
            pIban.setAlignment(Element.ALIGN_CENTER);
            pIban.setSpacingBefore(20);
            document.add(pIban);

            // 6. Pied de page
            ajouterPiedDePage(document);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur RIB PDF", e);
        }
    }

    /**
     * 2. GÉNÉRER UN RELEVÉ DE COMPTE
     */
//    public byte[] genererRelevePdf(String numeroCompte, LocalDateTime dateDebut, LocalDateTime dateFin) {
//        Compte compte = compteService.getCompteByNumero(numeroCompte);
//        List<Transaction> transactions = transactionRepository.findReleveByCompteAndDate(
//                compte.getNumeroCompte(), dateDebut, dateFin
//        );
//
//        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//            Document document = new Document(PageSize.A4.rotate()); // Format Paysage
//            PdfWriter.getInstance(document, out);
//            document.open();
//
//            // 1. Logo & En-tête
//            ajouterLogoEtEntete(document);
//
//            // 2. Titre et Période
//            ajouterTitre(document, "RELEVÉ DE COMPTE");
//
//            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
//            Paragraph pPeriode = new Paragraph("Période du " + dateDebut.format(fmt) + " au " + dateFin.format(fmt), FONT_SOUS_TITRE);
//            pPeriode.setAlignment(Element.ALIGN_CENTER);
//            pPeriode.setSpacingAfter(10);
//            document.add(pPeriode);
//
//            // Info Solde
//            PdfPTable soldeTable = new PdfPTable(1);
//            soldeTable.setWidthPercentage(40);
//            soldeTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
//            PdfPCell cellSolde = new PdfPCell(new Phrase("Solde au " + LocalDateTime.now().format(fmt) + " : " + compte.getSolde() + " FCFA", FONT_BOLD));
//            cellSolde.setBackgroundColor(COLOR_BACKGROUND_LIGHT);
//            cellSolde.setBorderColor(COLOR_PRIMARY);
//            cellSolde.setPadding(8);
//            cellSolde.setHorizontalAlignment(Element.ALIGN_CENTER);
//            soldeTable.addCell(cellSolde);
//            document.add(soldeTable);
//            document.add(new Paragraph(" "));
//
//            // 3. Tableau Transactions
//            PdfPTable table = new PdfPTable(5);
//            table.setWidthPercentage(100);
//            table.setWidths(new float[]{2, 3, 6, 2.5f, 2.5f});
//            table.setHeaderRows(1); // Répète l'en-tête si changement de page
//
//            ajouterHeaderCell(table, "Date");
//            ajouterHeaderCell(table, "Référence");
//            ajouterHeaderCell(table, "Description");
//            ajouterHeaderCell(table, "Débit");
//            ajouterHeaderCell(table, "Crédit");
//
//            DateTimeFormatter fmtHeure = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
//
//            // Boucle avec alternance de couleurs
//            for (int i = 0; i < transactions.size(); i++) {
//                Transaction t = transactions.get(i);
//                boolean isAlt = (i % 2 != 0); // Une ligne sur deux colorée
//
//                ajouterCelluleDonnee(table, t.getDateTransaction().format(fmtHeure), isAlt);
//                ajouterCelluleDonnee(table, t.getRefTransaction(), isAlt);
//                ajouterCelluleDonnee(table, t.getDescription(), isAlt);
//
//                boolean isCredit = isTransactionCredit(t, compte);
//
//                if (isCredit) {
//                    ajouterCelluleDonnee(table, "", isAlt); // Colonne Débit vide
//                    // Colonne Crédit
//                    PdfPCell cell = new PdfPCell(new Phrase("+ " + t.getMontant(), FONT_BOLD));
//                    styleCellDonnee(cell, isAlt);
//                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
//                    // On garde le vert pour l'argent qui rentre (conventionnel) mais doux
//                    cell.setBorderColor(COLOR_SECONDARY);
//                    table.addCell(cell);
//                } else {
//                    // Colonne Débit
//                    PdfPCell cell = new PdfPCell(new Phrase("" + t.getMontant(), FONT_NORMAL));
//                    styleCellDonnee(cell, isAlt);
//                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
//                    table.addCell(cell);
//                    ajouterCelluleDonnee(table, "", isAlt); // Colonne Crédit vide
//                }
//            }
//
//            document.add(table);
//            ajouterPiedDePage(document);
//
//            document.close();
//            return out.toByteArray();
//        } catch (Exception e) {
//            throw new RuntimeException("Erreur Relevé PDF", e);
//        }
//    }

    public byte[] genererRelevePdf(String numeroCompte, LocalDateTime dateDebut, LocalDateTime dateFin) {
        Compte compte = compteService.getCompteByNumero(numeroCompte);

        // 1. Récupération des données brutes (qui contiennent potentiellement le doublon)
        List<Transaction> transactionsBrutes = transactionRepository.findByCompteSourceOrCompteDestinationAndDateTransactionBetweenOrderByDateTransactionDesc(
                compte, compte, dateDebut, dateFin
        );
        List<Transaction> transactionsFiltrees = transactionsBrutes.stream()
                .filter(t -> {
                    boolean estSource = t.getCompteSource().getNumeroCompte().equals(numeroCompte);
                    String type = t.getType().toString();
                    if ("RETRAIT".equals(type) || "VERSEMENT".equals(type)) {
                        return true;
                    }
                    if ("VIREMENT".equals(type) && estSource && t.getMontant().compareTo(BigDecimal.ZERO) > 0) {
                        return false;
                    }

                    return true;
                })
                .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate()); // Format Paysage
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Logo & En-tête
            ajouterLogoEtEntete(document);

            // 2. Titre et Période
            ajouterTitre(document, "RELEVÉ DE COMPTE");

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            Paragraph pPeriode = new Paragraph("Période du " + dateDebut.format(fmt) + " au " + dateFin.format(fmt), FONT_SOUS_TITRE);
            pPeriode.setAlignment(Element.ALIGN_CENTER);
            pPeriode.setSpacingAfter(20);
            document.add(pPeriode);

            // Création d'une table conteneur de 3 colonnes pour gérer l'alignement
            PdfPTable headerTable = new PdfPTable(3);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{40f, 20f, 40f});
            PdfPCell cellNum = new PdfPCell(new Phrase("Compte " + compte.getTypeCompte().toString() + " : " + compte.getNumeroCompte(), FONT_BOLD));
            cellNum.setBackgroundColor(COLOR_BACKGROUND_LIGHT);
            cellNum.setBorderColor(COLOR_PRIMARY);
            cellNum.setPadding(8);
            cellNum.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellNum.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(cellNum);
            PdfPCell cellSpace = new PdfPCell(new Phrase(" "));
            cellSpace.setBorder(Rectangle.NO_BORDER); // Pas de bordure
            headerTable.addCell(cellSpace);
            PdfPCell cellSolde = new PdfPCell(new Phrase("Solde au " + LocalDateTime.now().format(fmt) + " : " + compte.getSolde() + " FCFA", FONT_BOLD));
            cellSolde.setBackgroundColor(COLOR_BACKGROUND_LIGHT);
            cellSolde.setBorderColor(COLOR_PRIMARY);
            cellSolde.setPadding(8);
            cellSolde.setHorizontalAlignment(Element.ALIGN_CENTER);
            cellSolde.setVerticalAlignment(Element.ALIGN_MIDDLE);
            headerTable.addCell(cellSolde);
            document.add(headerTable);
            document.add(new Paragraph(" ")); // Espace après le bloc

            // 3. Tableau Transactions
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2, 3, 6, 2.5f, 2.5f});
            table.setHeaderRows(1);

            ajouterHeaderCell(table, "Date");
            ajouterHeaderCell(table, "Référence");
            ajouterHeaderCell(table, "Description");
            ajouterHeaderCell(table, "Débit");
            ajouterHeaderCell(table, "Crédit");

            DateTimeFormatter fmtHeure = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            for (int i = 0; i < transactionsFiltrees.size(); i++) {
                Transaction t = transactionsFiltrees.get(i);
                boolean isAlt = (i % 2 != 0);

                ajouterCelluleDonnee(table, t.getDateTransaction().format(fmtHeure), isAlt);
                ajouterCelluleDonnee(table, t.getRefTransaction(), isAlt);
                ajouterCelluleDonnee(table, t.getDescription(), isAlt);

                boolean isCredit = isTransactionCredit(t, compte);

                if (isCredit) {
                    ajouterCelluleDonnee(table, "", isAlt); // Colonne Débit vide
                    // Colonne Crédit
                    PdfPCell cell = new PdfPCell(new Phrase("+ " + t.getMontant(), FONT_BOLD));
                    styleCellDonnee(cell, isAlt);
                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    cell.setBorderColor(COLOR_SECONDARY);
                    table.addCell(cell);
                } else {
                    // Colonne Débit
                    PdfPCell cell = new PdfPCell(new Phrase("" + t.getMontant(), FONT_NORMAL));
                    styleCellDonnee(cell, isAlt);
                    cell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(cell);
                    ajouterCelluleDonnee(table, "", isAlt); // Colonne Crédit vide
                }
            }

            document.add(table);
            ajouterPiedDePage(document);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur Relevé PDF", e);
        }
    }
    // --- HELPERS DE STYLISATION ---

    private void ajouterLogoEtEntete(Document document) throws DocumentException {
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1, 2});

        // Cellule Logo
        PdfPCell cellLogo = new PdfPCell();
        cellLogo.setBorder(Rectangle.NO_BORDER);
        try {

            ClassPathResource imageFile = new ClassPathResource("static/images/logo.png");
            Image img = Image.getInstance(imageFile.getURL());
            img.scaleToFit(50, 50); // Ajuster la taille
            cellLogo.addElement(img);
        } catch (Exception e) {
            cellLogo.addElement(new Phrase("EB", FONT_TITRE));
        }
        headerTable.addCell(cellLogo);

        // Cellule Texte Banque
        PdfPCell cellText = new PdfPCell();
        cellText.setBorder(Rectangle.NO_BORDER);
        cellText.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cellText.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph pName = new Paragraph("EGA BANQUE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, COLOR_PRIMARY));
        pName.setAlignment(Element.ALIGN_RIGHT);
        cellText.addElement(pName);

        Paragraph pSlogan = new Paragraph("L'excellence bancaire à votre service", FontFactory.getFont(FontFactory.HELVETICA, 10, COLOR_ACCENT));
        pSlogan.setAlignment(Element.ALIGN_RIGHT);
        cellText.addElement(pSlogan);

        headerTable.addCell(cellText);

        document.add(headerTable);

        // Ligne de séparation
        PdfPTable line = new PdfPTable(1);
        line.setWidthPercentage(100);
        PdfPCell cellLine = new PdfPCell();
        cellLine.setBorder(Rectangle.BOTTOM);
        cellLine.setBorderColor(COLOR_ACCENT);
        cellLine.setBorderWidth(2f);
        cellLine.setFixedHeight(10f);
        line.addCell(cellLine);
        document.add(line);
        document.add(new Paragraph(" "));
    }

    private void ajouterTitre(Document document, String texte) throws DocumentException {
        Paragraph titre = new Paragraph(texte, FONT_TITRE);
        titre.setAlignment(Element.ALIGN_CENTER);
        titre.setSpacingAfter(10);
        document.add(titre);
    }

    private void ajouterHeaderCell(PdfPTable table, String texte) {
        PdfPCell cell = new PdfPCell(new Phrase(texte, FONT_HEADER_TABLE));
        cell.setBackgroundColor(COLOR_SECONDARY); // Fond Violet Moyen
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(8);
        cell.setBorderColor(COLOR_PRIMARY);
        table.addCell(cell);
    }

    private void ajouterCelluleDonnee(PdfPTable table, String texte, boolean alternateColor) {
        PdfPCell cell = new PdfPCell(new Phrase(texte != null ? texte : "", FONT_NORMAL));
        styleCellDonnee(cell, alternateColor);
        table.addCell(cell);
    }

    private void styleCellDonnee(PdfPCell cell, boolean alternateColor) {
        cell.setPadding(6);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(COLOR_SECONDARY); // Bordure fine violette
        // Alternance de couleur de fond (Zebra striping)
        if (alternateColor) {
            cell.setBackgroundColor(COLOR_BACKGROUND_LIGHT);
        } else {
            cell.setBackgroundColor(Color.WHITE);
        }
    }

    private void ajouterPiedDePage(Document document) throws DocumentException {
        document.add(new Paragraph("\n\n"));
        PdfPTable footerTable = new PdfPTable(1);
        footerTable.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell(new Phrase("Document généré électroniquement par EGA Banque - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), FONT_FOOTER));
        cell.setBorder(Rectangle.TOP);
        cell.setBorderColor(COLOR_ACCENT);
        cell.setPaddingTop(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        footerTable.addCell(cell);
        document.add(footerTable);
    }

    private boolean isTransactionCredit(Transaction t, Compte compte) {
        if (t.getType() == TypeTransaction.VERSEMENT) return true;
        return t.getType() == TypeTransaction.VIREMENT &&
                t.getCompteDestination() != null &&
                t.getCompteDestination().getId().equals(compte.getId());
    }
}