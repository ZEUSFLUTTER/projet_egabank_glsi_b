package com.ega.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ega.dto.AuthRequestDTO;
import com.ega.dto.AuthResponseDTO;
import com.ega.dto.RefreshTokenRequestDTO;
import com.ega.dto.RegisterRequestDTO;
import com.ega.exception.DuplicateResourceException;
import com.ega.exception.ResourceNotFoundException;
import com.ega.exception.UnauthorizedException;
import com.ega.model.Client;
import com.ega.model.Role;
import com.ega.model.User;
import com.ega.repository.ClientRepository;
import com.ega.repository.UserRepository;
import com.ega.util.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponseDTO register(RegisterRequestDTO req) {

        if (userRepository.existsByCourriel(req.getCourriel())) {
            throw new DuplicateResourceException("Utilisateur déjà existant");
        }

        Client client = new Client();
        client.setNom(req.getNom());
        client.setPrenom(req.getPrenom());
        client.setDateNaissance(req.getDateNaissance());
        client.setSexe(req.getSexe());
        client.setAdresse(req.getAdresse());
        client.setTelephone(req.getTelephone());
        client.setCourriel(req.getCourriel());
        client.setNationalite(req.getNationalite());
        clientRepository.save(client);

        User user = new User();
        user.setCourriel(req.getCourriel());
        user.setMotDePasse(passwordEncoder.encode(req.getMotDePasse()));
        user.setRole(Role.ROLE_USER);
        user.setClient(client);
        user.setEnabled(true);
        userRepository.save(user);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getCourriel());

        return buildResponse(user, userDetails);
    }

    public AuthResponseDTO login(AuthRequestDTO req) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getCourriel(),
                        req.getMotDePasse()
                )
        );

        User user = userRepository.findByCourriel(req.getCourriel())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(req.getCourriel());

        return buildResponse(user, userDetails);
    }

    public AuthResponseDTO refreshAccessToken(RefreshTokenRequestDTO req) {

        String refreshToken = req.getRefreshToken();

        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new UnauthorizedException("Refresh token invalide");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        User user = userRepository.findByCourriel(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

        String newAccessToken = jwtUtil.generateAccessToken(userDetails);

        return buildResponse(user, userDetails, newAccessToken, refreshToken);
    }

    private AuthResponseDTO buildResponse(User user, UserDetails details) {
        return buildResponse(
                user,
                details,
                jwtUtil.generateAccessToken(details),
                jwtUtil.generateRefreshToken(details)
        );
    }

    private AuthResponseDTO buildResponse(
            User user,
            UserDetails details,
            String access,
            String refresh
    ) {
        return new AuthResponseDTO(
                access,
                refresh,
                "Bearer",
                user.getId(),
                user.getCourriel(),
                user.getRole(),
                180_000L
        );
    }
}
