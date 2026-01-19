package banque.entity;
import banque.enums.Sexe;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long id;

    @Column(nullable = false, length = 60)
    private String nom;

    @Column(nullable = false, length = 60)
    private String prenom;

    @Column(name = "date_naissance", nullable = false)
    private LocalDate dateNaiss;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sexe sexe;

    @Column(nullable = false, length = 100)
    private String adresse;

    @Column(nullable = false, length = 15)
    private String telephone;

    @Column(nullable = false, unique = true, length = 100)
    @Email(message = "Email Invalide")
    private String email;

    @Column(nullable = false, length = 70)
    private String nationalite;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToMany(mappedBy = "client", fetch = FetchType.EAGER)
    @ToString.Exclude
    @JsonIgnore
    private List<Compte> comptes;

    @Column(name = "est_supprime", nullable = false)
    private Boolean estSupprime = false;
    @Transient
    private String password;
}