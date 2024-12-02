# Verwende ein offizielles Node.js-Image als Basis
FROM node:16-alpine

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die package.json und package-lock.json, um die Abhängigkeiten zu installieren
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes in das Arbeitsverzeichnis
COPY . .

# Exponiere den Port 8080
EXPOSE 8080

# Starte die Anwendung
CMD ["npm", "run", "start"]
