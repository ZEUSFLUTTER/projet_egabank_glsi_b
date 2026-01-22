package com.ega.util;

import com.ega.exception.ResourceNotFoundException;
import com.ega.model.User;
import com.ega.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    /**
     * Récupère l'utilisateur connecté depuis le SecurityContext
     * @return L'utilisateur connecté
     * @throws ResourceNotFoundException si aucun utilisateur n'est connecté
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new ResourceNotFoundException("Aucun utilisateur connecté");
        }

        Object principal = authentication.getPrincipal();
        
        // Toujours recharger depuis le repository pour s'assurer que les relations LAZY sont chargées
        // dans une transaction active
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            String courriel = userDetails.getUsername();
            return userRepository.findByCourriel(courriel)
                    .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec le courriel: " + courriel));
        }

        throw new ResourceNotFoundException("Type d'utilisateur non reconnu");
    }

    /**
     * Récupère le courriel de l'utilisateur connecté
     * @return Le courriel de l'utilisateur connecté
     */
    public String getCurrentUserCourriel() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new ResourceNotFoundException("Aucun utilisateur connecté");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    /**
     * Vérifie si l'utilisateur connecté a le rôle admin
     * @return true si l'utilisateur est admin
     */
    public boolean isAdmin() {
        try {
            User user = getCurrentUser();
            return user.getRole().name().equals("ROLE_ADMIN");
        } catch (Exception e) {
            return false;
        }
    }
}

