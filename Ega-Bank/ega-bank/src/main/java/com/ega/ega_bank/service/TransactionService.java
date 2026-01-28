package com.ega.ega_bank.service;

import com.ega.ega_bank.dto.ReleveResponse;
import com.ega.ega_bank.entite.Compte;
import com.ega.ega_bank.entite.Transaction;
import com.ega.ega_bank.entite.enums.TypeOperation;
import com.ega.ega_bank.exception.BusinessException;
import com.ega.ega_bank.exception.NotFoundException;
import com.ega.ega_bank.repository.CompteRepository;
import com.ega.ega_bank.repository.TransactionRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

// ✅ OpenPDF imports
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
@Transactional
public class TransactionService {

    private final CompteRepository compteRepo;
    private final TransactionRepository txRepo;

    public TransactionService(CompteRepository compteRepo, TransactionRepository txRepo) {
        this.compteRepo = compteRepo;
        this.txRepo = txRepo;
    }

    //Vérifie que le compte appartient au client connecté (sauf admin)
    private void verifierProprietaire(Compte compte, String emailConnecte) {
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !compte.getProprietaire().getCourriel().equals(emailConnecte)) {
            throw new BusinessException("Vous ne pouvez pas effectuer d'opération sur un compte qui ne vous appartient pas");
        }
    }

    // --- DEPOT ---
    public Transaction depot(String numeroCompte, BigDecimal montant, String desc, String emailConnecte) {
        Compte compte = compteRepo.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));

        verifierProprietaire(compte, emailConnecte);

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }

        compte.setSolde(compte.getSolde().add(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.DEPOT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(compte);
        tx.setClient(compte.getProprietaire());
        tx.setDescription(desc);

        return txRepo.save(tx);
    }

    // --- DEPOT ADMIN (sans vérification de propriétaire) ---
    public Transaction depotAdmin(String numeroCompte, BigDecimal montant, String desc, String emailAdmin) {
        Compte compte = compteRepo.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }

        compte.setSolde(compte.getSolde().add(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.DEPOT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(compte);
        tx.setClient(compte.getProprietaire());
        tx.setDescription(desc != null ? desc : "Dépôt effectué par l'administrateur");

        return txRepo.save(tx);
    }

    // --- RETRAIT ---
    public Transaction retrait(String numeroCompte, BigDecimal montant, String desc, String emailConnecte) {
        Compte compte = compteRepo.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));

        verifierProprietaire(compte, emailConnecte);

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }
        if (compte.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        compte.setSolde(compte.getSolde().subtract(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.RETRAIT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(compte);
        tx.setClient(compte.getProprietaire());
        tx.setDescription(desc);

        return txRepo.save(tx);
    }

    // --- RETRAIT ADMIN (sans vérification de propriétaire) ---
    public Transaction retraitAdmin(String numeroCompte, BigDecimal montant, String desc, String emailAdmin) {
        Compte compte = compteRepo.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }
        if (compte.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        compte.setSolde(compte.getSolde().subtract(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.RETRAIT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(compte);
        tx.setClient(compte.getProprietaire());
        tx.setDescription(desc != null ? desc : "Retrait effectué par l'administrateur");

        return txRepo.save(tx);
    }

    // --- VIREMENT ---
    public Transaction virement(String source, String dest, BigDecimal montant, String desc, String emailConnecte) {
        if (Objects.equals(source, dest)) {
            throw new BusinessException("Comptes identiques");
        }

        Compte cSrc = compteRepo.findByNumeroCompte(source)
                .orElseThrow(() -> new NotFoundException("Compte source introuvable"));
        Compte cDst = compteRepo.findByNumeroCompte(dest)
                .orElseThrow(() -> new NotFoundException("Compte destination introuvable"));

        verifierProprietaire(cSrc, emailConnecte);

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }
        if (cSrc.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        cSrc.setSolde(cSrc.getSolde().subtract(montant));
        cDst.setSolde(cDst.getSolde().add(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.VIREMENT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(cSrc);
        tx.setCompteDestination(cDst);
        tx.setClient(cSrc.getProprietaire());
        tx.setDescription(desc);

        return txRepo.save(tx);
    }

    // --- VIREMENT ADMIN (sans vérification de propriétaire) ---
    public Transaction virementAdmin(String source, String dest, BigDecimal montant, String desc, String emailAdmin) {
        if (Objects.equals(source, dest)) {
            throw new BusinessException("Comptes identiques");
        }

        Compte cSrc = compteRepo.findByNumeroCompte(source)
                .orElseThrow(() -> new NotFoundException("Compte source introuvable"));
        Compte cDst = compteRepo.findByNumeroCompte(dest)
                .orElseThrow(() -> new NotFoundException("Compte destination introuvable"));

        if (montant.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Montant invalide");
        }
        if (cSrc.getSolde().compareTo(montant) < 0) {
            throw new BusinessException("Solde insuffisant");
        }

        cSrc.setSolde(cSrc.getSolde().subtract(montant));
        cDst.setSolde(cDst.getSolde().add(montant));

        Transaction tx = new Transaction();
        tx.setType(TypeOperation.VIREMENT);
        tx.setMontant(montant);
        tx.setDateOperation(LocalDateTime.now());
        tx.setCompteSource(cSrc);
        tx.setCompteDestination(cDst);
        tx.setClient(cSrc.getProprietaire());
        tx.setDescription(desc != null ? desc : "Virement effectué par l'administrateur");

        return txRepo.save(tx);
    }

    // --- HISTORIQUE PAR COMPTE ---
    public List<Transaction> transactionsParPeriode(Long compteId, LocalDateTime debut, LocalDateTime fin) {
        return txRepo.findByCompteAndPeriode(compteId, debut, fin);
    }

    // --- HISTORIQUE PAR CLIENT ---
    public List<Transaction> historiqueClient(Long clientId) {
        return txRepo.findByClientIdOrderByDateOperationDesc(clientId);
    }

    // --- TRANSACTIONS RÉCENTES (pour dashboard admin) ---
    public List<Transaction> getTransactionsRecentes(int limit) {
        return txRepo.findAllByOrderByDateOperationDesc(
            org.springframework.data.domain.PageRequest.of(0, limit)
        );
    }

    // --- HISTORIQUE PAR CLIENT ET PÉRIODE ---
    public List<Transaction> transactionsByClientAndPeriode(Long clientId, LocalDateTime debut, LocalDateTime fin) {
        return txRepo.findByClientAndPeriode(clientId, debut, fin);
    }

    // --- RELEVÉ CLIENT COMPLET (tous ses comptes) ---
    public ReleveResponse genererReleveClient(Long clientId, LocalDateTime debut, LocalDateTime fin) {
        List<Transaction> transactions = txRepo.findByClientAndPeriode(clientId, debut, fin);
        
        // Calculer les soldes de tous les comptes du client
        List<Compte> comptes = compteRepo.findByProprietaireId(clientId);
        BigDecimal soldeTotalFinal = comptes.stream()
                .map(Compte::getSolde)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculer le delta des transactions
        BigDecimal delta = transactions.stream().map(t -> {
            switch (t.getType()) {
                case DEPOT: return t.getMontant();
                case RETRAIT: return t.getMontant().negate();
                case VIREMENT:
                    // Vérifier si c'est un virement sortant ou entrant pour ce client
                    boolean isVirementSortant = t.getCompteSource() != null && 
                            comptes.stream().anyMatch(c -> c.getId().equals(t.getCompteSource().getId()));
                    boolean isVirementEntrant = t.getCompteDestination() != null && 
                            comptes.stream().anyMatch(c -> c.getId().equals(t.getCompteDestination().getId()));
                    
                    if (isVirementSortant && !isVirementEntrant) {
                        return t.getMontant().negate(); // Sortant uniquement
                    } else if (isVirementEntrant && !isVirementSortant) {
                        return t.getMontant(); // Entrant uniquement
                    } else {
                        return BigDecimal.ZERO; // Virement interne (entre comptes du même client)
                    }
                default: return BigDecimal.ZERO;
            }
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal soldeTotalInitial = soldeTotalFinal.subtract(delta);
        
        return new ReleveResponse(
                "CLIENT-" + clientId,
                debut,
                fin,
                soldeTotalInitial,
                soldeTotalFinal,
                transactions
        );
    }

    // --- RELEVÉ CLIENT PDF ---
    public byte[] genererReleveClientPdf(Long clientId, LocalDateTime debut, LocalDateTime fin) {
        ReleveResponse releve = genererReleveClient(clientId, debut, fin);
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Relevé Client - Historique des Transactions", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("Client ID : " + clientId));
            document.add(new Paragraph("Période : " + releve.getDebut() + " - " + releve.getFin()));
            document.add(new Paragraph("Solde total initial : " + releve.getSoldeInitial() + " FCFA"));
            document.add(new Paragraph("Solde total final : " + releve.getSoldeFinal() + " FCFA"));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.addCell("Date");
            table.addCell("Type");
            table.addCell("Montant");
            table.addCell("Compte Source");
            table.addCell("Description");

            for (Transaction tx : releve.getTransactions()) {
                table.addCell(tx.getDateOperation().toString());
                table.addCell(tx.getType().name());
                table.addCell(tx.getMontant().toPlainString() + " FCFA");
                table.addCell(tx.getCompteSource() != null ? tx.getCompteSource().getNumeroCompte() : "N/A");
                table.addCell(tx.getDescription() != null ? tx.getDescription() : "");
            }

            document.add(table);
            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new BusinessException("Erreur lors de la génération du PDF client : " + e.getMessage());
        }
    }

    // --- RELEVE JSON ---
    public ReleveResponse genererReleve(String numeroCompte, LocalDateTime debut, LocalDateTime fin) {
        Compte compte = compteRepo.findByNumeroCompte(numeroCompte)
                .orElseThrow(() -> new NotFoundException("Compte introuvable"));

        List<Transaction> txs = txRepo.findByCompteAndPeriode(compte.getId(), debut, fin);

        BigDecimal delta = txs.stream().map(t -> {
            switch (t.getType()) {
                case DEPOT: return t.getMontant();
                case RETRAIT: return t.getMontant().negate();
                case VIREMENT:
                    if (t.getCompteSource() != null &&
                            t.getCompteSource().getId().equals(compte.getId())) {
                        return t.getMontant().negate();
                    } else {
                        return t.getMontant();
                    }
                default: return BigDecimal.ZERO;
            }
        }).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal soldeFinal = compte.getSolde();
        BigDecimal soldeInitial = soldeFinal.subtract(delta);

        return new ReleveResponse(
                compte.getNumeroCompte(),
                debut,
                fin,
                soldeInitial,
                soldeFinal,
                txs
        );
    }

    // --- RELEVE PDF ---
    public byte[] genererRelevePdf(String numeroCompte, LocalDateTime debut, LocalDateTime fin) {
        ReleveResponse releve = genererReleve(numeroCompte, debut, fin);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Relevé de compte", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("Compte : " + releve.getNumeroCompte()));
            document.add(new Paragraph("Période : " + releve.getDebut() + " - " + releve.getFin()));
            document.add(new Paragraph("Solde initial : " + releve.getSoldeInitial()));
            document.add(new Paragraph("Solde final : " + releve.getSoldeFinal()));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.addCell("Date");
            table.addCell("Type");
            table.addCell("Montant");
            table.addCell("Description");

            for (Transaction tx : releve.getTransactions()) {
                table.addCell(tx.getDateOperation().toString());
                table.addCell(tx.getType().name());
                table.addCell(tx.getMontant().toPlainString());
                table.addCell(tx.getDescription() != null ? tx.getDescription() : "");
            }

            document.add(table);
            document.close();

            return baos.toByteArray();
        } catch (Exception e) {
            throw new BusinessException("Erreur lors de la génération du PDF : " + e.getMessage());
        }
    }
}
