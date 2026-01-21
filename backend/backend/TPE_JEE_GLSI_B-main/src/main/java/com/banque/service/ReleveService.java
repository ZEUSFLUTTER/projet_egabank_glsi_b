package com.banque.service;

import java.time.LocalDateTime;

public interface ReleveService {
    byte[] generateRelevePdf(Long compteId, LocalDateTime dateDebut, LocalDateTime dateFin);
}


