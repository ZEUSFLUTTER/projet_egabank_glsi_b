package com.banque.repository;

import com.banque.entity.Notification;
import com.banque.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByClientOrderByDateNotificationDesc(Client client);
    List<Notification> findByClientAndLuFalseOrderByDateNotificationDesc(Client client);
    Long countByClientAndLuFalse(Client client);
}
