# Architecture

## Vision technique

SCOLYRA est un monorepo pnpm séparant clairement :

- **apps/web** — présentation (Next.js App Router), aucune logique métier
  lourde ne doit y résider durablement.
- **packages/db** — unique source de vérité du schéma de données
  (Prisma), partagée par toute l'app.
- **packages/ai** — toute la logique IA (abstraction fournisseur,
  agents, orchestrateur), totalement découplée du fournisseur réel.
- **packages/ui** — composants partagés (à développer au-delà de la V0).

## Flux du coach IA (§13)

```
Message utilisateur
      ↓
AIOrchestrator.detectIntent()
      ↓
Agent spécialisé (Pedagogical / Objective / Revision / CopyAnalysis
                   / Orientation / Project)
      ↓
Profil pédagogique (StudentProfile, UserSubject, UserSkill, Grade, Mistake)
      ↓
AIProvider.generateText() / generateStructured()
      ↓
Réponse structurée → UI
```

## Pipeline RAG (documents) — architecture cible

```
Upload → Stockage (MinIO/S3) → OCR/extraction → Nettoyage → Chunking
      → embed() → DocumentChunk.embedding (pgvector) → Recherche
        sémantique → Contexte injecté dans le prompt de l'agent
```

État V0 : modèle de données prêt (`Document`, `DocumentChunk`), méthode
`embed()` mockée. Le pipeline d'ingestion réel (OCR, chunking, jobs
BullMQ) reste à construire — voir ROADMAP.md V1.

## Pourquoi une abstraction AI_PROVIDER ?

Pour ne jamais coupler le produit à un unique fournisseur, contrôler les
coûts (rôles fast/powerful/vision/embeddings), et permettre de tourner
entièrement en local (mode mock) pendant le développement.

## Pourquoi séparer packages/db ?

Un seul schéma Prisma, une seule migration history, utilisable aussi
bien par l'app web que par de futurs workers BullMQ ou scripts.
