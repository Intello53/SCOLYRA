#!/usr/bin/env bash
# Restaure un export créé par scripts/db-export.sh dans le conteneur
# scolyra-postgres actuel (ex: après avoir extrait une nouvelle version
# dans un nouveau dossier, pour récupérer les données d'une ancienne).
#
# ⚠️ Écrase les données actuellement dans la base "scolyra" (le dump
# contient déjà les instructions DROP/CREATE nécessaires, --clean
# --if-exists a été utilisé à l'export).
#
# Usage : bash scripts/db-import.sh chemin-du-backup.sql

set -euo pipefail
INPUT="${1:-}"
if [ -z "$INPUT" ] || [ ! -f "$INPUT" ]; then
  echo "Usage : bash scripts/db-import.sh chemin-du-backup.sql"
  echo "(fichier introuvable : '$INPUT')"
  exit 1
fi

echo "⚠️  Ceci va remplacer le contenu actuel de la base 'scolyra'."
read -p "Continuer ? [o/N] " confirm
if [ "$confirm" != "o" ] && [ "$confirm" != "O" ]; then
  echo "Annulé."
  exit 0
fi

docker exec -i scolyra-postgres psql -U scolyra -d scolyra < "$INPUT"

echo "✓ Import terminé depuis : $INPUT"
