package com.ega.banking.controller;

import com.ega.banking.dto.NotificationDTO;
import com.ega.banking.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notifications", description = "Gestion des notifications utilisateur")
public class NotificationController {

    private final NotificationService notificationService;
    private final com.ega.banking.repository.UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Obtenir toutes les notifications de l'utilisateur connecté")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(Authentication authentication) {
        Long subjectId = getCurrentSubjectId(authentication);
        log.info("Fetching notifications for subject ID: {}", subjectId);
        List<NotificationDTO> notifications = notificationService.getUserNotifications(subjectId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @Operation(summary = "Obtenir les notifications non lues")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(Authentication authentication) {
        Long subjectId = getCurrentSubjectId(authentication);
        List<NotificationDTO> notifications = notificationService.getUnreadNotifications(subjectId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Obtenir le nombre de notifications non lues")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        Long subjectId = getCurrentSubjectId(authentication);
        long count = notificationService.getUnreadCount(subjectId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Marquer une notification comme lue")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Marquer toutes les notifications comme lues")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        Long subjectId = getCurrentSubjectId(authentication);
        notificationService.markAllAsRead(subjectId);
        return ResponseEntity.ok().build();
    }

    private Long getCurrentSubjectId(Authentication authentication) {
        String username = authentication.getName();
        if (username.startsWith("CLIENT_ID:")) {
            return Long.parseLong(username.substring(10));
        }

        // Pour les administrateurs, on récupère l'ID du User
        return userRepository.findByUsername(username)
                .map(com.ega.banking.model.User::getId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + username));
    }
}
