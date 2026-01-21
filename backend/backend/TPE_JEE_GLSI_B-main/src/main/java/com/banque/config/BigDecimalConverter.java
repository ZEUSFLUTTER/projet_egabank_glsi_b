package com.banque.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class BigDecimalConverter implements Converter<String, BigDecimal> {
    
    @Override
    public BigDecimal convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(source);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Impossible de convertir '" + source + "' en BigDecimal", e);
        }
    }
}
