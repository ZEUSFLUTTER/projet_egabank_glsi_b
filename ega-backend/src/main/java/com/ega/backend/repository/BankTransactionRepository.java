package com.ega.backend.repository;

import com.ega.backend.domain.BankTransaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {
    @Query("select t from BankTransaction t where (t.sourceAccount.id = :accountId or t.destinationAccount.id = :accountId) and t.operationDate between :from and :to order by t.operationDate desc")
    List<BankTransaction> findByAccountIdAndPeriod(@Param("accountId") Long accountId,
                                                   @Param("from") Instant from,
                                                   @Param("to") Instant to);

    @Query("select t from BankTransaction t where t.sourceAccount.id = :accountId or t.destinationAccount.id = :accountId order by t.operationDate desc")
    List<BankTransaction> findByAccountId(@Param("accountId") Long accountId);

    @Query("select t from BankTransaction t where t.operationDate between :from and :to order by t.operationDate desc")
    List<BankTransaction> findByPeriod(@Param("from") java.time.Instant from, @Param("to") java.time.Instant to);
    
    @Query("select t from BankTransaction t where t.sourceAccount.id = :accountId or t.destinationAccount.id = :accountId order by t.operationDate desc")
    List<BankTransaction> findByAccountIdLimited(@Param("accountId") Long accountId, Pageable pageable);
    
    @Query("select t from BankTransaction t where (t.sourceAccount.id = :accountId or t.destinationAccount.id = :accountId) and t.operationDate between :from and :to order by t.operationDate desc")
    List<BankTransaction> findByAccountAndPeriod(@Param("accountId") Long accountId,
                                               @Param("from") Instant from,
                                               @Param("to") Instant to);
}
