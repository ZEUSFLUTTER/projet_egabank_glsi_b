package banque.entity;
import banque.enums.StatutCompte;
import banque.enums.TypeCompte;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "comptes")
public class Compte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_compte")
    private Long id;

    @Column(name = "numero_compte", length = 28, nullable = false, unique = true)
    private String numeroCompte;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_compte", nullable = false)
    private TypeCompte typeCompte;

    @Column(name = "date_creation", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    @NotNull
    @PositiveOrZero
    private BigDecimal solde = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutCompte statut = StatutCompte.ACTIF;

    @Column(name = "date_cloture")
    private LocalDateTime dateCloture;

    // Relation : Un compte appartient à UN client
    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties("comptes")
    @JoinColumn(name = "client_id", nullable = false)
    @ToString.Exclude
    private Client client;

}