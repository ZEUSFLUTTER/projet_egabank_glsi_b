package com.ega.backend.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("SAVINGS")
@Getter
@Setter
@NoArgsConstructor
public class SavingsAccount extends Account {
}
