FROM postgres:15-alpine

# Copier le script d'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Variables d'environnement par défaut
ENV POSTGRES_DB=egabank
ENV POSTGRES_USER=egauser
ENV POSTGRES_PASSWORD=egapassword
