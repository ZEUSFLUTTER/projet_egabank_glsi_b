package com.maxime.Ega.repository;

import com.maxime.Ega.entity.Account;
import com.maxime.Ega.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Account findByAccountNumber(String accountNumber);
    List<Account> findByDeletedFalse();
    List<Account> findByDeletedTrue();
    List<Account> findByClientEmailAndClientDeletedTrue(String clientEmail);
    List<Account> findByClientEmailAndClientDeletedFalse(String clientEmail);

    List<Account> findByClient(Client client);
}
