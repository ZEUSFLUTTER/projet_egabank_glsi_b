package com.ega.backend.domain;

import com.ega.backend.domain.enums.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "clients", uniqueConstraints = {
        @UniqueConstraint(name = "uk_clients_email", columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotNull
    private LocalDate birthDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @NotBlank
    @Size(max = 255)
    private String address;

    @NotBlank
    @Size(max = 20)
    private String phone;

    @NotBlank
    @Email
    @Size(max = 150)
    private String email;

    @NotBlank
    @Size(max = 100)
    private String nationality;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Account> accounts = new HashSet<>();
}
