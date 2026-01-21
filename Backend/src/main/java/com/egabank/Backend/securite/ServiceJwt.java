/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.securite;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 *
 * @author HP
 */
@Service
public class ServiceJwt {
    private final SecretKey cle;
    private final long dureeMillisecondes;

    public ServiceJwt(
            @Value("${securite.jwt.secret}") String secret,
            @Value("${securite.jwt.dureeSecondes}") long dureeSecondes
    ) {
        this.cle = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.dureeMillisecondes = dureeSecondes * 1000L;
    }

    public String genererJeton(String nomUtilisateur, String role) {
        Date maintenant = new Date();
        Date expiration = new Date(maintenant.getTime() + dureeMillisecondes);

        return Jwts.builder()
                .subject(nomUtilisateur)
                .claim("role", role)
                .issuedAt(maintenant)
                .expiration(expiration)
                .signWith(cle)
                .compact();
    }

    public Claims lireClaims(String jeton) {
        return Jwts.parser()
                .verifyWith(cle) 
                .build()
                .parseSignedClaims(jeton)
                .getPayload();
    }
}
