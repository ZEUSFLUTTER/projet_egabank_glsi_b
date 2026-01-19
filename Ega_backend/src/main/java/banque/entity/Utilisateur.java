package banque.entity;
import banque.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@ToString
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN ou CLIENT

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true; // true = peut se connecter, false = bloqué

    // Un utilisateur peut être lié à une fiche client (Si Role = CLIENT)
    // C'est nullable car l'Admin n'a pas de fiche client bancaire
    @OneToOne
    @JoinColumn(name = "client_id", nullable = true)
    @ToString.Exclude
    private Client client;
}