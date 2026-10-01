#!/usr/bin/env node
/**
 * Charge le .env de la RACINE du monorepo dans l'environnement, puis
 * exécute la commande passée après `--`. Remplace dotenv-cli : moins
 * de dépendances, et surtout un message d'erreur explicite si le
 * fichier manque, plutôt qu'un échec silencieux qui remonte comme une
 * erreur Prisma incompréhensible ("Environment variable not found").
 *
 * Usage : node <chemin>/scripts/with-root-env.js -- <commande> [args...]
 *
 * Cause la plus fréquente de "DATABASE_URL introuvable" : ce script
 * vient d'être extrait dans un NOUVEAU dossier (ex: V9/SCOLYRA) et
 * .env n'y a pas encore été recréé — il n'est jamais inclus dans le
 * zip (voir docs/SECURITY.md), seul .env.example l'est.
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function findRepoRoot(startDir) {
  let dir = startDir;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function parseEnvFile(content) {
  const vars = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

const root = findRepoRoot(process.cwd());
if (!root) {
  console.error("\n❌ Racine du monorepo introuvable (pnpm-workspace.yaml absent des dossiers parents).\n");
  process.exit(1);
}

const envPath = path.join(root, ".env");
if (!fs.existsSync(envPath)) {
  console.error(`
❌ Le fichier .env est introuvable : ${envPath}

   Il doit exister À LA RACINE de SCOLYRA. Il n'est JAMAIS inclus dans
   le zip (volontairement, voir docs/SECURITY.md) — si tu viens
   d'extraire une nouvelle version dans un nouveau dossier, il faut le
   recréer ICI :

     cp .env.example .env
     openssl rand -base64 32   # colle le résultat dans NEXTAUTH_SECRET du .env
`);
  process.exit(1);
}

const parsed = parseEnvFile(fs.readFileSync(envPath, "utf-8"));
// Les vraies variables d'environnement déjà présentes (PATH, etc.)
// restent prioritaires — seules les variables du .env sont ajoutées.
const mergedEnv = { ...parsed, ...process.env };

if (!mergedEnv.DATABASE_URL) {
  console.error(`
❌ DATABASE_URL est absent ou vide dans : ${envPath}

   Vérifie qu'il contient une ligne telle que :
   DATABASE_URL="postgresql://scolyra:scolyra@localhost:5432/scolyra?schema=public"
`);
  process.exit(1);
}

const sepIndex = process.argv.indexOf("--");
const command = process.argv.slice(sepIndex + 1);
if (command.length === 0) {
  console.error("Usage : node with-root-env.js -- <commande> [args...]");
  process.exit(1);
}

const result = spawnSync(command[0], command.slice(1), {
  stdio: "inherit",
  env: mergedEnv,
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
