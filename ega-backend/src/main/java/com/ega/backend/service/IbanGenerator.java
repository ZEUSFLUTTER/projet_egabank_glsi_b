package com.ega.backend.service;

import org.iban4j.CountryCode;
import org.iban4j.Iban;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class IbanGenerator {
    private final CountryCode countryCode;

    public IbanGenerator(@Value("${app.iban.country:FR}") String country) {
        CountryCode code;
        try {
            code = CountryCode.valueOf(country);
        } catch (Exception e) {
            code = CountryCode.FR;
        }
        this.countryCode = code;
    }

    public String newIban() {
        return Iban.random(countryCode).toString();
    }
}
