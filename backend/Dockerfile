# syntax=docker/dockerfile:1

# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/app.jar app.jar

# Expose the API port
EXPOSE 8080

# Environment variables for SQLite persistence within Docker
# Note: In a real docker setup, you'd mount a volume for the .db file
ENTRYPOINT ["java", "-jar", "app.jar"]
