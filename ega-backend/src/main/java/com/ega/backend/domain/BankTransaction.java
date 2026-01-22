package com.ega.backend.domain;

import com.ega.backend.domain.enums.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, precision = 19, scale = 2)
    @Positive
    private BigDecimal amount;

    @Column(name = "operation_date", nullable = false)
    private Instant operationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_account_id", foreignKey = @ForeignKey(name = "fk_tx_source"))
    private Account sourceAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_account_id", foreignKey = @ForeignKey(name = "fk_tx_destination"))
    private Account destinationAccount;
}
