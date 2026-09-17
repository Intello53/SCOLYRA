# Démarrage rapide

## Prérequis

Vérifier ce qui est déjà installé (ne rien réinstaller par défaut) :

```bash
git --version
node --version
pnpm --version
docker --version
docker compose version
```

Si `pnpm` manque :

```bash
corepack enable
corepack prepare pnpm@9.9.0 --activate
```

## Étapes

```bash
git clone <url-de-votre-dépôt> SCOLYRA
cd SCOLYRA
pnpm install
cp .env.example .env
docker compose -f infra/docker-compose.yml up -d
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
pnpm dev
```

Ouvrir http://localhost:3000/dashboard — les données affichées sont
100% fictives (mode démo), aucune clé API externe n'est requise.

Pour la suite, voir [INSTALLATION.md](INSTALLATION.md) (détail de
chaque étape) et [TUTORIEL.md](TUTORIEL.md) (guide complet 26
sections).
