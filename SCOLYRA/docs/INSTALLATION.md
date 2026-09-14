# Installation détaillée (Fedora)

## 1. Mettre à jour le système (optionnel, à votre discrétion)

```bash
sudo dnf upgrade --refresh -y
```

Cette commande met à jour les paquets système. Elle ne supprime rien de
votre installation existante mais peut mettre à jour des versions de
paquets — vérifiez si cela convient à votre contexte avant de lancer.

## 2. Outils de base

```bash
sudo dnf install -y git curl
```

## 3. Node.js (20+)

Vérifier d'abord :

```bash
node --version
```

Si absent ou trop ancien :

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
```

## 4. pnpm

```bash
corepack enable
corepack prepare pnpm@9.9.0 --activate
```

## 5. Docker + Docker Compose

Vérifier d'abord :

```bash
docker --version
docker compose version
```

Si absent, suivre la documentation officielle Docker pour Fedora
(dnf config-manager + dnf install docker-ce). Ne pas exécuter de
commande d'installation Docker sans avoir vérifié qu'elle correspond à
votre version de Fedora — les paquets évoluent.

## 6. Cloner et installer

```bash
git clone <url-de-votre-dépôt> SCOLYRA
cd SCOLYRA
pnpm install
```

## 7. Configurer l'environnement

```bash
cp .env.example .env
```

Voir chaque variable expliquée dans `.env.example` directement (commentaires
inline). Les valeurs par défaut fonctionnent pour un usage local.

## 8. Démarrer l'infrastructure

```bash
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml ps
```

## 9. Base de données

```bash
pnpm db:migrate
pnpm db:seed
pnpm seed:demo
```

## 10. Lancer l'application

```bash
pnpm dev
```

http://localhost:3000
