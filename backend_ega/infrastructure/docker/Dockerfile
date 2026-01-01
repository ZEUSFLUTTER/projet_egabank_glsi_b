# Dockerfile pour le Système Bancaire EGA

# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .

# Télécharger les dépendances (mise en cache)
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Compiler et packager l'application (sans exécuter les tests)
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring

# Copier le JAR depuis le stage de build
COPY --from=build /app/target/banking-1.0.0.jar app.jar

# Changer le propriétaire du fichier
RUN chown spring:spring app.jar

# Utiliser l'utilisateur non-root
USER spring:spring

# Exposer le port de l'application
EXPOSE 8080

# Configuration des variables d'environnement par défaut
ENV SPRING_PROFILES_ACTIVE=h2
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Healthcheck pour vérifier si l'application est en bonne santé
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Commande de démarrage
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
