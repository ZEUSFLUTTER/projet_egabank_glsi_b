package com.banque.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String message;
    
    @Column(name = "date_notification", nullable = false, updatable = false, columnDefinition = "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateNotification;
    
    @Column(name = "lu", nullable = false)
    private Boolean lu = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client", nullable = false)
    private Client client;
    
    @PrePersist
    protected void onCreate() {
        if (dateNotification == null) {
            dateNotification = LocalDateTime.now();
        }
        if (lu == null) {
            lu = false;
        }
    }
}
