package com.maxime.Ega.entity;

import com.maxime.Ega.enums.AccountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "account")
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false ,unique = true)
    private String accountNumber;

    @Column(name = "account_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(name = "createAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "balance", nullable = false)
    @PositiveOrZero
    private BigDecimal balance =  BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToOne(cascade = CascadeType.PERSIST)
    private Client client;

    @ManyToOne
    private User user;

}
