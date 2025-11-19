#!/bin/bash
# Script de démarrage pour Render
# Ce script s'assure que toutes les configurations sont correctes avant de démarrer

set -e

# Vérifier que le build a réussi
if [ ! -d "packages/cli/dist" ]; then
  echo "Error: Build directory not found. Please run 'pnpm build' first."
  exit 1
fi

# S'assurer que le port est défini (Render fournit PORT automatiquement)
if [ -z "$PORT" ] && [ -z "$N8N_PORT" ]; then
  echo "Warning: PORT or N8N_PORT not set. Using default port 5678"
  export N8N_PORT=5678
elif [ -z "$N8N_PORT" ]; then
  # Utiliser le port fourni par Render
  export N8N_PORT=$PORT
fi

# Démarrer l'application
cd packages/cli
node dist/index.js start

