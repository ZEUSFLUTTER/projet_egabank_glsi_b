package banque.service;

import banque.dto.AuthResponseDto;
import banque.dto.LoginDto;
import banque.dto.RegisterDto;
import banque.entity.Client;
import banque.entity.Utilisateur;
import banque.enums.Role;
import banque.repository.ClientRepository;
import banque.repository.UtilisateurRepository;
import banque.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import banque.exception.BanqueException; // Assurez-vous d'avoir cette exception ou RuntimeException

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    /**
     * INSCRIPTION CLIENT
     */
    @Transactional
    public void register(RegisterDto request) {
        if (utilisateurRepository.findByUsername(request.getEmail()).isPresent()) {
            throw new BanqueException("Cet email est déjà utilisé.");
        }
        if (clientRepository.findByTelephoneAndEstSupprimeFalse(request.getTelephone()).isPresent()) {
            throw new BanqueException("Ce numéro de téléphone est déjà utilisé.");
        }

        Client client = Client.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .adresse(request.getAdresse())
                .dateNaiss(request.getDateNaiss())
                .sexe(request.getSexe())
                .nationalite(request.getNationalite())
                .estSupprime(false)
                .build();

        Client savedClient = clientRepository.save(client);

        Utilisateur user = Utilisateur.builder()
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .actif(true)
                .client(savedClient)
                .build();

        utilisateurRepository.save(user);
    }

    /**
     * CONNEXION (Mise à jour pour retourner l'ID)
     */
    public AuthResponseDto login(LoginDto request) {
        // 1. Authentification Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 2. Génération du Token
        String token = jwtUtils.generateToken(userDetails);

        // 3. Récupération du Rôle
        String role = userDetails.getAuthorities().stream()
                .findFirst()
                .map(item -> item.getAuthority())
                .orElse("ROLE_CLIENT");

        // 4. RÉCUPÉRATION DE L'ID (Partie ajoutée)
        // On va chercher l'utilisateur en base pour récupérer son lien avec le Client
        Utilisateur user = utilisateurRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BanqueException("Utilisateur introuvable"));

        Long id;
        // Si l'utilisateur est lié à un client (Cas normal pour ROLE_CLIENT)
        if (user.getClient() != null) {
            id = user.getClient().getId();
        } else {
            // Cas Admin (ou utilisateur sans fiche client)
            id = user.getId();
        }

        // 5. Retourne le DTO complet (correspondant à l'interface Angular)
        return new AuthResponseDto(token, role, userDetails.getUsername(), id);
    }
}