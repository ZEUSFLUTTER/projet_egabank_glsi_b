package banque.entity;
import banque.enums.TypeTransaction;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction")
    private Long id;

    @Column(name = "reference_transaction",nullable = false,updatable = false,unique = true,length = 100)
    private String refTransaction;

    @Column(name = "type_transaction", nullable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private TypeTransaction type;

    @Column(nullable = false, updatable = false)
    @NotNull
    private BigDecimal montant;

    @Column(name = "date_transaction", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateTransaction = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "compte_source_id", nullable = false, updatable = false)
    @ToString.Exclude
    private Compte compteSource;

    // Compte destinataire (seulement pour virement)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "compte_destination_id", nullable = true)
    @ToString.Exclude
    private Compte compteDestination;

    // Solde après opération
    @Column(name = "solde_apres", nullable = false, updatable = false)
    private BigDecimal soldeApres;

    @Column(nullable = false)
    private String description;

    @PrePersist
    public void generateReference() {
        this.refTransaction =
                "EGA-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID();
    }
}
