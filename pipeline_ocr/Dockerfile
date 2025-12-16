# Utilisation d'une image Python légère
FROM python:3.10-slim

# CORRECTION ICI : Remplacement de libgl1-mesa-glx par libgl1
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Définition du dossier de travail
WORKDIR /app

# Copie du fichier de dépendances
COPY requirements.txt .

# Installation des librairies Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY main.py .

# Création du dossier pour les modèles EasyOCR
RUN mkdir -p /root/.EasyOCR

# Exposition du port 8000
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]