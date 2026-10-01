#!/usr/bin/env bash
# Exporte toute la base de données SCOLYRA dans un fichier .sql, pour
# pouvoir la restaurer plus tard (nouvelle version, autre machine...)
# via scripts/db-import.sh. Nécessite que le conteneur scolyra-postgres
# tourne (docker compose up -d).
#
# Usage : bash scripts/db-export.sh [chemin-de-sortie.sql]

set -euo pipefail
OUTPUT="${1:-scolyra-backup-$(date +%Y%m%d-%H%M%S).sql}"

docker exec scolyra-postgres pg_dump -U scolyra -d scolyra --clean --if-exists > "$OUTPUT"

echo "✓ Export terminé : $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
echo "  Pour restaurer ailleurs : bash scripts/db-import.sh $OUTPUT"
