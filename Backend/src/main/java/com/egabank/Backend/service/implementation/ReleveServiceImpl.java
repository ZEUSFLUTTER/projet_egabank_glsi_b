package com.egabank.Backend.service.implementation;

import com.egabank.Backend.entity.Compte;
import com.egabank.Backend.entity.Releve;
import com.egabank.Backend.entity.Transaction;
import com.egabank.Backend.repository.CompteRepository;
import com.egabank.Backend.repository.ReleveRepository;
import com.egabank.Backend.repository.TransactionRepository;
import com.egabank.Backend.service.ReleveService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 *
 * @author HP
 */
@Service
@Transactional
public class ReleveServiceImpl implements ReleveService {
    
    private final ReleveRepository releveRepository;
    private final TransactionRepository transactionRepository;
    private final CompteRepository compteRepository;

    public ReleveServiceImpl(ReleveRepository releveRepository, 
                           TransactionRepository transactionRepository,
                           CompteRepository compteRepository) {
        this.releveRepository = releveRepository;
        this.transactionRepository = transactionRepository;
        this.compteRepository = compteRepository;
    }

    @Override
    public Releve creer(Releve releve) {
        return releveRepository.save(releve);
    }

    @Override
    @Transactional(readOnly = true)
    public Releve consulter(Long id) {
        return releveRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Relevé non trouvé: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Releve> listerParCompte(String numeroCompte) {
        return releveRepository.findByNumeroCompte(numeroCompte);
    }

    @Override
    public void supprimer(Long id) {
        Releve releve = consulter(id);
        releveRepository.delete(releve);
    }

    @Override
    public byte[] genererRelevePdf(String numeroCompte, LocalDate dateDebut, LocalDate dateFin) {
        try {
            // Récupérer le compte
            Compte compte = compteRepository.findByNumeroCompte(numeroCompte)
                    .orElseThrow(() -> new IllegalArgumentException("Compte non trouvé: " + numeroCompte));

            // Récupérer les transactions pour la période
            LocalDateTime debut = dateDebut.atStartOfDay();
            LocalDateTime fin = LocalDateTime.of(dateFin, LocalTime.MAX);
            List<Transaction> transactions = transactionRepository.listerParPeriode(numeroCompte, debut, fin);

            // Si pas de transactions, créer un PDF avec message
            if (transactions.isEmpty()) {
                return genererPdfVide(compte, dateDebut, dateFin);
            }

            // Créer le document PDF
            Document document = new Document(PageSize.A4);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();

            // En-tête du relevé
            ajouterEnTete(document, compte, dateDebut, dateFin);
            
            // Informations du compte
            ajouterInfosCompte(document, compte);
            
            // Tableau des transactions
            ajouterTableauTransactions(document, transactions);
            
            // Résumé financier
            ajouterResume(document, transactions, compte);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF: " + e.getMessage(), e);
        }
    }

    private byte[] genererPdfVide(Compte compte, LocalDate dateDebut, LocalDate dateFin) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);

        document.open();

        // En-tête
        ajouterEnTete(document, compte, dateDebut, dateFin);
        ajouterInfosCompte(document, compte);

        // Message d'absence de transactions
        Font messageFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.GRAY);
        Paragraph message = new Paragraph("Aucune transaction trouvée pour cette période.", messageFont);
        message.setAlignment(Element.ALIGN_CENTER);
        message.setSpacingBefore(50);
        message.setSpacingAfter(50);
        document.add(message);

        // Informations du compte quand même
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Paragraph soldeInfo = new Paragraph("Solde actuel du compte: " + 
                                          String.format("%.2f €", compte.getSolde()), boldFont);
        soldeInfo.setAlignment(Element.ALIGN_CENTER);
        document.add(soldeInfo);

        document.close();
        return baos.toByteArray();
    }

    private void ajouterEnTete(Document document, Compte compte, LocalDate dateDebut, LocalDate dateFin) throws DocumentException {
        // Logo et titre
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
        Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.GRAY);

        Paragraph title = new Paragraph("🏦 EGABANK - RELEVÉ BANCAIRE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(10);
        document.add(title);

        Paragraph period = new Paragraph("Période du " + dateDebut.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + 
                                       " au " + dateFin.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), subtitleFont);
        period.setAlignment(Element.ALIGN_CENTER);
        period.setSpacingAfter(20);
        document.add(period);

        // Ligne de séparation
        document.add(new Paragraph("_".repeat(80)));
        document.add(Chunk.NEWLINE);
    }

    private void ajouterInfosCompte(Document document, Compte compte) throws DocumentException {
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingAfter(15);

        // Informations du titulaire
        PdfPCell titulaire = new PdfPCell(new Phrase("TITULAIRE DU COMPTE", boldFont));
        titulaire.setBorder(Rectangle.NO_BORDER);
        titulaire.setPaddingBottom(5);
        infoTable.addCell(titulaire);

        PdfPCell infosCompte = new PdfPCell(new Phrase("INFORMATIONS DU COMPTE", boldFont));
        infosCompte.setBorder(Rectangle.NO_BORDER);
        infosCompte.setPaddingBottom(5);
        infoTable.addCell(infosCompte);

        // Nom du titulaire
        String nomTitulaire = compte.getProprietaire() != null ? 
            compte.getProprietaire().getNom() + " " + compte.getProprietaire().getPrenom() : "N/A";
        PdfPCell nom = new PdfPCell(new Phrase(nomTitulaire, normalFont));
        nom.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(nom);

        // Numéro de compte
        PdfPCell numero = new PdfPCell(new Phrase("N° de compte: " + compte.getNumeroCompte(), normalFont));
        numero.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(numero);

        // Adresse (si disponible)
        String adresse = compte.getProprietaire() != null ? compte.getProprietaire().getAdresse() : "N/A";
        PdfPCell adresseCell = new PdfPCell(new Phrase(adresse, normalFont));
        adresseCell.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(adresseCell);

        // Type de compte
        String typeCompte = compte.getClass().getSimpleName().replace("Compte", "");
        PdfPCell type = new PdfPCell(new Phrase("Type: Compte " + typeCompte, normalFont));
        type.setBorder(Rectangle.NO_BORDER);
        infoTable.addCell(type);

        document.add(infoTable);
        document.add(Chunk.NEWLINE);
    }

    private void ajouterTableauTransactions(Document document, List<Transaction> transactions) throws DocumentException {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 9, Font.BOLD, BaseColor.WHITE);
        Font cellFont = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL);

        // Titre du tableau
        Paragraph tableTitle = new Paragraph("DÉTAIL DES OPÉRATIONS", 
                                           new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD));
        tableTitle.setSpacingAfter(10);
        document.add(tableTitle);

        // Créer le tableau
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{2, 1.5f, 1, 3});

        // En-têtes
        PdfPCell[] headers = {
            new PdfPCell(new Phrase("Date", headerFont)),
            new PdfPCell(new Phrase("Type", headerFont)),
            new PdfPCell(new Phrase("Montant (€)", headerFont)),
            new PdfPCell(new Phrase("Libellé", headerFont))
        };

        for (PdfPCell header : headers) {
            header.setBackgroundColor(BaseColor.DARK_GRAY);
            header.setPadding(8);
            header.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(header);
        }

        // Données des transactions
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        
        for (Transaction transaction : transactions) {
            // Date
            PdfPCell dateCell = new PdfPCell(new Phrase(transaction.getDateTransaction().format(formatter), cellFont));
            dateCell.setPadding(5);
            table.addCell(dateCell);

            // Type
            PdfPCell typeCell = new PdfPCell(new Phrase(getTypeLabel(transaction.getType()), cellFont));
            typeCell.setPadding(5);
            typeCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(typeCell);

            // Montant
            String montantStr = String.format("%.2f", transaction.getMontant());
            if ("DEPOT".equals(transaction.getType())) {
                montantStr = "+" + montantStr;
            } else if ("RETRAIT".equals(transaction.getType())) {
                montantStr = "-" + montantStr;
            }
            
            PdfPCell montantCell = new PdfPCell(new Phrase(montantStr, cellFont));
            montantCell.setPadding(5);
            montantCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            
            // Couleur selon le type
            if ("DEPOT".equals(transaction.getType())) {
                montantCell.setBackgroundColor(new BaseColor(220, 255, 220)); // Vert clair
            } else if ("RETRAIT".equals(transaction.getType())) {
                montantCell.setBackgroundColor(new BaseColor(255, 220, 220)); // Rouge clair
            }
            
            table.addCell(montantCell);

            // Libellé
            PdfPCell libelleCell = new PdfPCell(new Phrase(transaction.getLibelle(), cellFont));
            libelleCell.setPadding(5);
            table.addCell(libelleCell);
        }

        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void ajouterResume(Document document, List<Transaction> transactions, Compte compte) throws DocumentException {
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);

        // Calculs
        double totalDepots = transactions.stream()
                .filter(t -> "DEPOT".equals(t.getType()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        double totalRetraits = transactions.stream()
                .filter(t -> "RETRAIT".equals(t.getType()))
                .mapToDouble(Transaction::getMontant)
                .sum();

        int nombreOperations = transactions.size();

        // Tableau de résumé
        PdfPTable resumeTable = new PdfPTable(2);
        resumeTable.setWidthPercentage(60);
        resumeTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        // Titre
        PdfPCell resumeTitle = new PdfPCell(new Phrase("RÉSUMÉ DE LA PÉRIODE", boldFont));
        resumeTitle.setColspan(2);
        resumeTitle.setHorizontalAlignment(Element.ALIGN_CENTER);
        resumeTitle.setPadding(8);
        resumeTitle.setBackgroundColor(BaseColor.LIGHT_GRAY);
        resumeTable.addCell(resumeTitle);

        // Nombre d'opérations
        resumeTable.addCell(new PdfPCell(new Phrase("Nombre d'opérations:", normalFont)));
        resumeTable.addCell(new PdfPCell(new Phrase(String.valueOf(nombreOperations), normalFont)));

        // Total des dépôts
        resumeTable.addCell(new PdfPCell(new Phrase("Total des dépôts:", normalFont)));
        PdfPCell depotCell = new PdfPCell(new Phrase(String.format("+%.2f €", totalDepots), normalFont));
        depotCell.setBackgroundColor(new BaseColor(220, 255, 220));
        resumeTable.addCell(depotCell);

        // Total des retraits
        resumeTable.addCell(new PdfPCell(new Phrase("Total des retraits:", normalFont)));
        PdfPCell retraitCell = new PdfPCell(new Phrase(String.format("-%.2f €", totalRetraits), normalFont));
        retraitCell.setBackgroundColor(new BaseColor(255, 220, 220));
        resumeTable.addCell(retraitCell);

        // Solde actuel
        resumeTable.addCell(new PdfPCell(new Phrase("Solde actuel:", boldFont)));
        PdfPCell soldeCell = new PdfPCell(new Phrase(String.format("%.2f €", compte.getSolde()), boldFont));
        soldeCell.setBackgroundColor(BaseColor.YELLOW);
        resumeTable.addCell(soldeCell);

        document.add(resumeTable);

        // Pied de page
        document.add(Chunk.NEWLINE);
        Paragraph footer = new Paragraph("Document généré automatiquement le " + 
                                       LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + 
                                       " - EgaBank © 2026", 
                                       new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }

    private String getTypeLabel(String type) {
        return switch (type) {
            case "DEPOT" -> "Dépôt";
            case "RETRAIT" -> "Retrait";
            case "VIREMENT" -> "Virement";
            default -> type;
        };
    }
}
