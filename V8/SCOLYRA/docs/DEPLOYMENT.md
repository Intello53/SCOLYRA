# Déploiement

⚠️ **Non couvert par cette génération** : aucune configuration de
déploiement (Dockerfile de production, pipeline CI/CD, configuration
d'hébergement) n'a été créée. Ce document décrit uniquement
l'architecture cible et les points d'attention.

## Points d'attention avant tout déploiement

1. **Base de données** : PostgreSQL managé avec extension `pgvector`
   disponible (ex. Neon, Supabase, RDS avec extension activée).
2. **Stockage** : remplacer MinIO par un vrai service S3-compatible en
   production — l'abstraction de stockage doit être créée dans
   `apps/web/lib/storage/` (non encore implémentée en V0) pour permettre
   ce basculement sans changer le reste du code.
3. **Redis** : instance managée pour BullMQ (ex. Upstash, Redis Cloud).
4. **Secrets** : jamais dans le dépôt Git — variables d'environnement
   gérées par la plateforme d'hébergement.
5. **Migrations** : utiliser `prisma migrate deploy` (jamais `migrate
   dev`) en production.
6. **Stripe** : basculer sur les clés LIVE uniquement après validation
   complète du parcours en mode TEST, et après validation juridique
   RGPD/mineurs (voir SECURITY.md).
7. **AI_PROVIDER** : ne jamais laisser `mock` en production si des
   fonctionnalités IA réelles sont attendues par les utilisateurs —
   configurer un vrai fournisseur et sa clé.

## Build

```bash
pnpm build
pnpm start
```

À adapter selon la plateforme cible (conteneur Docker, Vercel, serveur
Node classique, etc.) — le choix n'a pas été arbitré dans cette
génération.
