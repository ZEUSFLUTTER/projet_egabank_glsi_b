package com.maxime.Ega.service;

import com.maxime.Ega.dto.transaction.TransactionDepWithDto;
import com.maxime.Ega.dto.transaction.TransferDto;

import java.math.BigDecimal;

public interface ITransactionService {
    public void deposit(TransactionDepWithDto  transactionDepWithDto);
    public void withdraw(TransactionDepWithDto  transactionDepWithDto);
    public void transfer(TransferDto  transferDto);
}
