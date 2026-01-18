#!/bin/bash
# Hot-patch notifications into running backend container

echo "🔧 Hot-patching notification system into backend..."

# Copy new notification files into container
docker cp backend_ega/src/main/java/com/ega/banking/model/Notification.java ega-backend:/app/src/main/java/com/ega/banking/model/
docker cp backend_ega/src/main/java/com/ega/banking/repository/NotificationRepository.java ega-backend:/app/src/main/java/com/ega/banking/repository/
docker cp backend_ega/src/main/java/com/ega/banking/dto/NotificationDTO.java ega-backend:/app/src/main/java/com/ega/banking/dto/
docker cp backend_ega/src/main/java/com/ega/banking/service/NotificationService.java ega-backend:/app/src/main/java/com/ega/banking/service/
docker cp backend_ega/src/main/java/com/ega/banking/controller/NotificationController.java ega-backend:/app/src/main/java/com/ega/banking/controller/
docker cp backend_ega/src/main/java/com/ega/banking/service/TransactionService.java ega-backend:/app/src/main/java/com/ega/banking/service/

# Recompile inside container and restart
docker exec ega-backend bash -c "cd /app && mvn clean package -DskipTests"

# Restart container to pick up new JAR
docker restart ega-backend

echo "✅ Done! Backend restarting with notification support..."
