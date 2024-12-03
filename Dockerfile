FROM node:22.11.0 as base

WORKDIR /usr/src/app

# Installation des dépendances système nécessaires
RUN apt-get update && apt-get install -y wget && \
    wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 mssql-tools18 unixodbc-dev && \
    rm packages-microsoft-prod.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Variables d'environnement
ENV PORT=8080
ENV DB_Host=172.20.48.1
ENV DB_User=root
ENV DB_Passwd=root@1234
ENV NODE_ENV=development
ENV PATH="$PATH:/opt/mssql-tools18/bin"

# Copie des fichiers de dépendances
COPY package*.json ./

# Étape de développement
FROM base as development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

EXPOSE 8080