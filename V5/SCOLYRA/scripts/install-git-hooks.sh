#!/usr/bin/env bash
# Installe un hook pre-commit local qui bloque un commit contenant un
# .env réel ou une clé Stripe/API visiblement en clair. Filet de
# sécurité en plus du scan GitHub Actions (qui, lui, agit après coup).
#
# Usage : bash scripts/install-git-hooks.sh

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

mkdir -p .git/hooks
cat > .git/hooks/pre-commit << 'HOOK'
#!/usr/bin/env bash
set -euo pipefail

staged=$(git diff --cached --name-only)

# Bloque tout fichier .env réel (l'exemple .env.example reste autorisé)
if echo "$staged" | grep -E "(^|/)\.env(\.\w+)?$" | grep -vE "\.env\.example$" >/dev/null; then
  echo "❌ Commit bloqué : un fichier .env réel est sur le point d'être committé."
  echo "   Retire-le avec : git restore --staged <fichier>"
  exit 1
fi

# Motifs de clés API évidents (Stripe, AWS, clés privées PEM...)
patterns='sk_live_[0-9a-zA-Z]{16,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY-----'
if git diff --cached -U0 | grep -E "$patterns" >/dev/null; then
  echo "❌ Commit bloqué : une clé/secret d'aspect réel a été détecté dans les changements."
  echo "   Vérifie le diff avec : git diff --cached"
  exit 1
fi

exit 0
HOOK

chmod +x .git/hooks/pre-commit
echo "✓ Hook pre-commit installé (.git/hooks/pre-commit)."
