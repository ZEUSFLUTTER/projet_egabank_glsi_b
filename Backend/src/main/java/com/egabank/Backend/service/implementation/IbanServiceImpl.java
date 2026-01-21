/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.egabank.Backend.service.implementation;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;
import com.egabank.Backend.service.IbanService;
import org.iban4j.CountryCode;
import org.iban4j.Iban;


/**
 *
 * @author HP
 */
@Service
public class IbanServiceImpl implements IbanService{
    private final SecureRandom aleatoire = new SecureRandom();

    @Override
    public String genererIban() {
        String codeBanque = nombre(5);
        String codeGuichet = nombre(5);
        String numeroCompte = alphanumerique(11);
        String cleRib = nombre(2);

        return new Iban.Builder()
                .countryCode(CountryCode.FR)
                .bankCode(codeBanque)
                .branchCode(codeGuichet)
                .accountNumber(numeroCompte)
                .nationalCheckDigit(cleRib)
                .build()
                .toString();
    }

    private String nombre(int longueur) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < longueur; i++) sb.append(aleatoire.nextInt(10));
        return sb.toString();
    }

    private String alphanumerique(int longueur) {
        String alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < longueur; i++) sb.append(alphabet.charAt(aleatoire.nextInt(alphabet.length())));
        return sb.toString();
    }
}
