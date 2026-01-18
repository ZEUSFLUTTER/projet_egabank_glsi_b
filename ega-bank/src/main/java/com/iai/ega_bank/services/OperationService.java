package com.iai.ega_bank.services;

import com.iai.ega_bank.dto.OperationDto;
import com.iai.ega_bank.entities.CompteBancaire;
import com.iai.ega_bank.entities.Operation;

import java.util.List;

public interface OperationService {

    CompteBancaire debit(OperationDto operationDto);
    CompteBancaire credit(OperationDto operationDto);
    List<Operation> findOperationsByCompte(String numCompte);

    boolean transact(OperationDto dto);
}
