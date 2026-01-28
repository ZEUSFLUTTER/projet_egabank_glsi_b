package com.ega.ega_bank.util;

import org.iban4j.CountryCode;
import org.iban4j.Iban;

public class IbanUtil {

    private IbanUtil() {
        // util class
    }

    public static String generateIbanFrance() {
        return Iban.random(CountryCode.FR).toString();
    }

    public static void validateIban(String iban) {
        org.iban4j.IbanUtil.validate(iban);
    }
}
