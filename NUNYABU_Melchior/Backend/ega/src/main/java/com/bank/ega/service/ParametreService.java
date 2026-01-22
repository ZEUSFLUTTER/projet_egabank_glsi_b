package com.bank.ega.service;

import com.bank.ega.entity.Parametre;
import com.bank.ega.entity.Utilisateur;
import com.bank.ega.exception.ClientNotFoundException;
import com.bank.ega.repository.ParametreRepository;
import com.bank.ega.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ParametreService {

    private final ParametreRepository parametreRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ParametreService(ParametreRepository parametreRepository, 
                           UtilisateurRepository utilisateurRepository) {
        this.parametreRepository = parametreRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Obtenir tous les paramètres d'un utilisateur
    public List<Parametre> getParametres(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé"));
        return parametreRepository.findByUtilisateur(utilisateur);
    }

    // Obtenir un paramètre spécifique
    public Optional<Parametre> getParametre(String username, String cle) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé"));
        return parametreRepository.findByUtilisateurAndCle(utilisateur, cle);
    }

    // Créer ou mettre à jour un paramètre
    public Parametre saveParametre(String username, String cle, String valeur) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé"));

        Optional<Parametre> existing = parametreRepository.findByUtilisateurAndCle(utilisateur, cle);

        Parametre parametre;
        if (existing.isPresent()) {
            parametre = existing.get();
            parametre.setValeur(valeur);
            parametre.setDateModification(LocalDateTime.now());
        } else {
            parametre = new Parametre();
            parametre.setUtilisateur(utilisateur);
            parametre.setCle(cle);
            parametre.setValeur(valeur);
            parametre.setDateCreation(LocalDateTime.now());
            parametre.setDateModification(LocalDateTime.now());
        }

        return parametreRepository.save(parametre);
    }

    // Supprimer un paramètre
    public void deleteParametre(String username, String cle) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ClientNotFoundException("Utilisateur non trouvé"));

        Optional<Parametre> parametre = parametreRepository.findByUtilisateurAndCle(utilisateur, cle);
        if (parametre.isPresent()) {
            parametreRepository.delete(parametre.get());
        }
    }

    // Obtenir la valeur d'un paramètre avec défaut
    public String getParametreValeur(String username, String cle, String defaultValue) {
        return getParametre(username, cle)
                .map(Parametre::getValeur)
                .orElse(defaultValue);
    }
}
