package com.banque.service.impl;

import com.banque.dto.TransactionDTO;
import com.banque.entity.Compte;
import com.banque.repository.CompteRepository;
import com.banque.service.ReleveService;
import com.banque.service.TransactionService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
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
    public byte[] generateRelevePdf(Long identifiantCompte, LocalDateTime debutPeriode, LocalDateTime finPeriode) {
        try {
            // Vérification existence du compte
            Compte compte = compteRepository.findById(identifiantCompte)
                    .orElseThrow(() -> new RuntimeException("Aucun compte correspondant à l'identifiant : " + identifiantCompte));
            
            // Récupération historique des opérations
            List<TransactionDTO> operations;
            if (debutPeriode != null || finPeriode != null) {
                operations = transactionService.getTransactionsByCompteAndPeriod(identifiantCompte, debutPeriode, finPeriode);
            } else {
                operations = transactionService.getTransactionsByCompte(identifiantCompte);
            }
            
            ByteArrayOutputStream fluxSortie = new ByteArrayOutputStream();
            PdfWriter ecrivain = new PdfWriter(fluxSortie);
            PdfDocument documentPdf = new PdfDocument(ecrivain);
            Document document = new Document(documentPdf);

            // Configuration typographique
            PdfFont policeNormale = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            PdfFont policeGras = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            
            // Palette chromatique
            Color bleuPrincipal = new DeviceRgb(33, 150, 243);
            Color bleuClair = new DeviceRgb(227, 242, 253);
            Color bleuFonce = new DeviceRgb(13, 71, 161);
            Color blanc = ColorConstants.WHITE;
            Color grisTexte = new DeviceRgb(97, 97, 97);
            
            // ========== EN-TÊTE INSTITUTIONNELLE ==========
            Paragraph enteteInstitution = new Paragraph("INSTITUTION FINANCIÈRE EGA")
                    .setFont(policeGras)
                    .setFontSize(20)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(8)
                    .setFontColor(blanc);
            
            Cell celluleEntete = new Cell().add(enteteInstitution)
                    .setBackgroundColor(bleuFonce)
                    .setPadding(18)
                    .setBorder(null);
            
            Table tableauEntete = new Table(UnitValue.createPercentArray(new float[]{1}))
                    .useAllAvailableWidth()
                    .setMarginBottom(15);
            tableauEntete.addCell(celluleEntete);
            document.add(tableauEntete);
            
            // Coordonnées
            Paragraph coordonnees = new Paragraph("Avenue des Institutions Financières, Immeuble EGA\n" +
                    "01 BP 1234 Lomé - Togo\n" +
                    "Téléphone : (+228) 22 21 20 19 - Email : contact@egafinance.tg")
                    .setFont(policeNormale)
                    .setFontSize(9)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(25)
                    .setFontColor(grisTexte);
            document.add(coordonnees);
            
            // ========== TITRE PRINCIPAL ==========
            Paragraph titrePrincipal = new Paragraph("DOCUMENT SYNTHÈTIQUE DE COMPTE")
                    .setFont(policeGras)
                    .setFontSize(22)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(30)
                    .setFontColor(bleuFonce);
            document.add(titrePrincipal);
            
            // ========== SECTION INFORMATIONS COMPTE ==========
            Paragraph sousTitreInfos = new Paragraph("INFORMATIONS DU COMPTE BANCAIRE")
                    .setFont(policeGras)
                    .setFontSize(12)
                    .setMarginBottom(15)
                    .setFontColor(bleuPrincipal);
            document.add(sousTitreInfos);
            
            Table tableauInformations = new Table(UnitValue.createPercentArray(new float[]{1, 2}))
                    .useAllAvailableWidth()
                    .setMarginBottom(25);
            
            ajouterLigneTableau(tableauInformations, "Détenteur du compte :", 
                    compte.getClient().getPrenom() + " " + compte.getClient().getNom(), 
                    bleuPrincipal, bleuClair, policeGras, policeNormale);
            
            ajouterLigneTableau(tableauInformations, "Référence compte :", 
                    compte.getNumCompte(), 
                    bleuPrincipal, bleuClair, policeGras, policeNormale);
            
            ajouterLigneTableau(tableauInformations, "Nature du compte :", 
                    compte.getTypeCompte().toString(), 
                    bleuPrincipal, bleuClair, policeGras, policeNormale);
            
            ajouterLigneTableau(tableauInformations, "Unité monétaire :", 
                    "Franc CFA (XOF)", 
                    bleuPrincipal, bleuClair, policeGras, policeNormale);
            
            ajouterLigneTableau(tableauInformations, "Date ouverture :", 
                    compte.getDateCreation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), 
                    bleuPrincipal, bleuClair, policeGras, policeNormale);
            
            document.add(tableauInformations);
            
            // ========== PÉRIODE D'ANALYSE ==========
            Paragraph libellePeriode = new Paragraph("INTERVALLE TEMPOREL ANALYSÉ")
                    .setFont(policeGras)
                    .setFontSize(12)
                    .setMarginBottom(10)
                    .setFontColor(bleuPrincipal);
            document.add(libellePeriode);
            
            String descriptionPeriode = composerDescriptionPeriode(debutPeriode, finPeriode);
            Paragraph textePeriode = new Paragraph(descriptionPeriode)
                    .setFont(policeNormale)
                    .setFontSize(10)
                    .setMarginBottom(20)
                    .setPaddingLeft(10)
                    .setFontColor(grisTexte);
            document.add(textePeriode);
            
            // ========== CALCUL SOLDE INITIAL ==========
            BigDecimal soldeInitial = calculerSoldeInitial(compte.getSolde(), operations, identifiantCompte);
            
            Paragraph affichageSoldeInitial = new Paragraph("ENCASSEMENT INITIAL : " + formaterMontant(soldeInitial) + " XOF")
                    .setFont(policeGras)
                    .setFontSize(11)
                    .setMarginBottom(15)
                    .setBackgroundColor(bleuClair)
                    .setPadding(10)
                    .setFontColor(bleuFonce);
            document.add(affichageSoldeInitial);
            
            // ========== TABLEAU DES MOUVEMENTS ==========
            if (!operations.isEmpty()) {
                Paragraph titreMouvements = new Paragraph("RÉCAPITULATIF DES OPÉRATIONS")
                        .setFont(policeGras)
                        .setFontSize(12)
                        .setMarginBottom(10)
                        .setMarginTop(20)
                        .setFontColor(bleuPrincipal);
                document.add(titreMouvements);
                
                Table tableauMouvements = new Table(UnitValue.createPercentArray(new float[]{1.5f, 3, 1.2f, 1.2f, 1.2f}))
                        .useAllAvailableWidth()
                        .setMarginTop(10);
                
                // En-têtes tableau
                String[] entetes = {"Date opération", "Désignation", "Sorties", "Entrées", "Solde intermédiaire"};
                for (String entete : entetes) {
                    tableauMouvements.addHeaderCell(
                        new Cell().add(new Paragraph(entete).setFont(policeGras).setFontSize(9).setFontColor(blanc))
                            .setTextAlignment(TextAlignment.CENTER)
                            .setBackgroundColor(bleuPrincipal)
                            .setPadding(10)
                    );
                }
                
                // Remplissage des opérations
                BigDecimal soldeProgressif = soldeInitial;
                DateTimeFormatter formatDate = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                int compteurLigne = 0;
                
                for (TransactionDTO operation : operations) {
                    String designation = operation.getDescription() != null ? 
                            operation.getDescription() : "Opération " + operation.getTypeTransaction();
                    
                    String montantSortie = "";
                    String montantEntree = "";
                    
                    if (operation.getTypeTransaction().name().equals("DEPOT") || 
                        (operation.getTypeTransaction().name().equals("TRANSFERT") && 
                         operation.getCompteDestinationId().equals(identifiantCompte))) {
                        montantEntree = formaterMontant(operation.getMontant());
                        soldeProgressif = soldeProgressif.add(operation.getMontant());
                    } else if (operation.getTypeTransaction().name().equals("RETRAIT") || 
                              (operation.getTypeTransaction().name().equals("TRANSFERT") && 
                               operation.getCompteSourceId().equals(identifiantCompte))) {
                        montantSortie = formaterMontant(operation.getMontant());
                        soldeProgressif = soldeProgressif.subtract(operation.getMontant());
                    }
                    
                    // Alternance couleurs lignes
                    Color fondLigne = (compteurLigne % 2 == 0) ? blanc : bleuClair;
                    compteurLigne++;
                    
                    // Ajout ligne
                    tableauMouvements.addCell(creerCellule(operation.getDateTransaction().format(formatDate), 
                            fondLigne, policeNormale, 8, TextAlignment.LEFT));
                    tableauMouvements.addCell(creerCellule(designation, 
                            fondLigne, policeNormale, 8, TextAlignment.LEFT));
                    tableauMouvements.addCell(creerCellule(montantSortie, 
                            fondLigne, policeNormale, 8, TextAlignment.RIGHT));
                    tableauMouvements.addCell(creerCellule(montantEntree, 
                            fondLigne, policeNormale, 8, TextAlignment.RIGHT));
                    tableauMouvements.addCell(creerCellule(formaterMontant(soldeProgressif), 
                            fondLigne, policeGras, 8, TextAlignment.RIGHT));
                }
                
                document.add(tableauMouvements);
            } else {
                Paragraph messageAucuneOperation = new Paragraph("AUCUNE OPÉRATION ENREGISTRÉE SUR CETTE PÉRIODE")
                        .setFont(policeNormale)
                        .setFontSize(10)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setFontColor(grisTexte)
                        .setMarginTop(30)
                        .setMarginBottom(30);
                document.add(messageAucuneOperation);
            }
            
            // ========== SYNTHÈSE FINALE ==========
            document.add(new Paragraph("\n"));
            
            Paragraph syntheseFinale = new Paragraph("SITUATION FINALE DU COMPTE")
                    .setFont(policeGras)
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(10)
                    .setFontColor(blanc)
                    .setBackgroundColor(bleuFonce)
                    .setPadding(15);
            document.add(syntheseFinale);
            
            Table tableauSynthese = new Table(UnitValue.createPercentArray(new float[]{2, 1}))
                    .useAllAvailableWidth()
                    .setMarginBottom(20);
            
            tableauSynthese.addCell(creerCellule("Total des encaissements :", 
                    bleuClair, policeGras, 10, TextAlignment.LEFT));
            tableauSynthese.addCell(creerCellule(calculerTotalCredits(operations, identifiantCompte), 
                    bleuClair, policeNormale, 10, TextAlignment.RIGHT));
            
            tableauSynthese.addCell(creerCellule("Total des décaissements :", 
                    blanc, policeGras, 10, TextAlignment.LEFT));
            tableauSynthese.addCell(creerCellule(calculerTotalDebits(operations, identifiantCompte), 
                    blanc, policeNormale, 10, TextAlignment.RIGHT));
            
            tableauSynthese.addCell(creerCellule("Solde final disponible :", 
                    bleuClair, policeGras, 11, TextAlignment.LEFT));
            tableauSynthese.addCell(creerCellule(formaterMontant(compte.getSolde()) + " XOF", 
                    bleuClair, policeGras, 11, TextAlignment.RIGHT));
            
            document.add(tableauSynthese);
            
            // ========== MENTIONS LÉGALES ==========
            document.add(new Paragraph("\n"));
            
            Paragraph mentionsLegales = new Paragraph("DOCUMENT À VALEUR PROBATOIRE\n" +
                    "Ce document constitue une pièce justificative officielle de votre activité bancaire.\n" +
                    "Conservez-le pour vos archives personnelles et déclarations fiscales.")
                    .setFont(policeNormale)
                    .setFontSize(8)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(25)
                    .setFontColor(grisTexte);
            document.add(mentionsLegales);
            
            // ========== PIED DE PAGE ==========
            Paragraph piedPage = new Paragraph("______________________________________________________\n" +
                    "Service Clientèle : (+228) 70 00 00 00 (24h/24) | Site Internet : www.egafinance.tg\n" +
                    "Document édité automatiquement le : " + 
                    LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy 'à' HH:mm:ss")))
                    .setFont(policeNormale)
                    .setFontSize(7)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(15)
                    .setFontColor(grisTexte);
            document.add(piedPage);
            
            document.close();
            
            return fluxSortie.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Impossible de produire le document : " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTHODES AUXILIAIRES ==========
    
    private void ajouterLigneTableau(Table tableau, String libelle, String valeur, 
                                     Color couleurLibelle, Color couleurValeur,
                                     PdfFont policeLibelle, PdfFont policeValeur) {
        tableau.addCell(new Cell().add(new Paragraph(libelle).setFont(policeLibelle).setFontSize(10))
                .setBackgroundColor(couleurLibelle)
                .setPadding(10)
                .setFontColor(ColorConstants.WHITE));
        
        tableau.addCell(new Cell().add(new Paragraph(valeur).setFont(policeValeur).setFontSize(10))
                .setBackgroundColor(couleurValeur)
                .setPadding(10)
                .setFontColor(new DeviceRgb(33, 33, 33)));
    }
    
    private Cell creerCellule(String contenu, Color fond, PdfFont police, 
                             int taillePolice, TextAlignment alignement) {
        return new Cell().add(new Paragraph(contenu).setFont(police).setFontSize(taillePolice))
                .setBackgroundColor(fond)
                .setPadding(8)
                .setTextAlignment(alignement);
    }
    
    private String composerDescriptionPeriode(LocalDateTime debut, LocalDateTime fin) {
        DateTimeFormatter formateur = DateTimeFormatter.ofPattern("dd MMMM yyyy");
        
        if (debut != null && fin != null) {
            return "Du " + debut.format(formateur) + " au " + fin.format(formateur);
        } else if (debut != null) {
            return "À compter du " + debut.format(formateur);
        } else if (fin != null) {
            return "Jusqu'au " + fin.format(formateur);
        } else {
            return "Historique complet depuis l'ouverture";
        }
    }
    
    private BigDecimal calculerSoldeInitial(BigDecimal soldeActuel, List<TransactionDTO> operations, Long compteId) {
        BigDecimal soldeInitial = soldeActuel;
        
        for (TransactionDTO operation : operations) {
            String type = operation.getTypeTransaction().name();
            
            if (type.equals("DEPOT")) {
                soldeInitial = soldeInitial.subtract(operation.getMontant());
            } else if (type.equals("RETRAIT")) {
                soldeInitial = soldeInitial.add(operation.getMontant());
            } else if (type.equals("TRANSFERT")) {
                if (operation.getCompteSourceId().equals(compteId)) {
                    soldeInitial = soldeInitial.add(operation.getMontant());
                } else {
                    soldeInitial = soldeInitial.subtract(operation.getMontant());
                }
            }
        }
        
        return soldeInitial;
    }
    
    private String formaterMontant(BigDecimal montant) {
        if (montant == null) return "0,00";
        return String.format("%,.2f", montant).replace(",", " ").replace(".", ",");
    }
    
    private String calculerTotalCredits(List<TransactionDTO> operations, Long compteId) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (TransactionDTO op : operations) {
            String type = op.getTypeTransaction().name();
            
            if (type.equals("DEPOT") || 
                (type.equals("TRANSFERT") && op.getCompteDestinationId().equals(compteId))) {
                total = total.add(op.getMontant());
            }
        }
        
        return formaterMontant(total) + " XOF";
    }
    
    private String calculerTotalDebits(List<TransactionDTO> operations, Long compteId) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (TransactionDTO op : operations) {
            String type = op.getTypeTransaction().name();
            
            if (type.equals("RETRAIT") || 
                (type.equals("TRANSFERT") && op.getCompteSourceId().equals(compteId))) {
                total = total.add(op.getMontant());
            }
        }
        
        return formaterMontant(total) + " XOF";
    }
}