# Conformité juridique, RGPD et accessibilité — état réel (V11)

> ⚠️ Ce document décrit ce qui est **implémenté dans le code**. Il ne certifie
> aucune conformité : les textes légaux sont des modèles construits à partir du
> fonctionnement réel du service et **doivent être relus par un professionnel du
> droit** (avocat, DPO externe) avant toute ouverture au public.

## 1. À faire AVANT la mise en ligne

1. Compléter `apps/web/lib/legal.ts` (éditeur, hébergeur, médiateur, TVA…). Tant que des champs
   sont vides, les pages affichent « À COMPLÉTER » en surbrillance — rien n'est inventé.
2. Choisir un **médiateur de la consommation** et l'indiquer (obligatoire pour vendre à des particuliers).
3. Définir `CRON_SECRET` et programmer chaque jour : `POST /api/cron/purge` (durées de conservation).
4. Lancer `pnpm db:migrate` (nouvelles colonnes/valeurs : `User.lastLoginAt`, `ConsentType.CGV_ACCEPTANCE`,
   `ConsentType.IMMEDIATE_ACCESS_REQUEST`).
5. En production : `NEXT_PUBLIC_DEMO_MODE` absent ou `false`, pas de `seed:demo`, Stripe configuré
   (la bascule Premium sans paiement est désormais refusée en production).
6. Configurer dans Stripe : Billing Portal avec **annulation d'abonnement activée**, e-mails de reçu/facture,
   et l'adresse du support. Vérifier que le texte du bouton de paiement reste « avec obligation de paiement ».
7. Faire valider : mécanisme d'accord parental (< 15 ans), durées de conservation, mentions TVA.

## 2. Ce qui a été ajouté / corrigé

| Domaine | Changement |
|---|---|
| Pages légales | `/mentions-legales`, `/confidentialite` (tableau données/finalités/bases/durées), `/cgu`, `/cgv`, `/cookies`, `/retractation` (formulaire type), `/accessibilite` — toutes alimentées par `lib/legal.ts` |
| Cookies | Audit : seuls les cookies next-auth (session, CSRF, callback) sont déposés, tous strictement nécessaires → **pas de bandeau requis**. Aucun analytics, pas de localStorage, polices auto-hébergées (`next/font`). Un bandeau (avec refus aussi simple que l'acceptation) devra être ajouté **avant** tout outil de mesure d'audience |
| Mineurs | Case « je suis mineur » (décochable pour contourner) remplacée par une tranche d'âge : < 15 ans = e-mail du parent obligatoire, accès bloqué (`/accord-parental`) jusqu'à confirmation ; consentement versionné dans `Consent` |
| Minimisation | E-mail du parent retiré du journal d'audit ; comptes « parent » non validés supprimés après 7 jours ; export complet (art. 15/20) ; purge des logs, tickets clos et comptes inactifs |
| Suppression de compte | Résilie d'abord l'abonnement Stripe, supprime les comptes parent orphelins ; webhook Stripe tolérant aux comptes supprimés |
| Vente | Cases CGV + « accès immédiat / rétractation » obligatoires côté client **et** serveur, enregistrées dans `Consent` ; bouton « avec obligation de paiement » ; résiliation en ligne ; prix TTC |
| Sécurité | Messages d'erreur techniques masqués en production ; échappement HTML du prénom dans l'e-mail au parent ; `Cache-Control: no-store` et `noindex` sur l'API ; CSP partielle |
| Accessibilité | Lien d'évitement, `<main>`, libellés sur 37 champs, `role="alert"` sur les erreurs, `aria-pressed`, menus mobiles (Échap, `aria-modal`), `prefers-reduced-motion` pour framer-motion, SVG décoratifs masqués, zoom autorisé |
| Contrastes | Textes `ink-900/35…55` et `white/35…50` (2,2 à 4,1:1) relevés à ≥ 4,5:1 ; bordures de champs ≥ 3:1 ; placeholders ; badge or |
| Agents IA / SEO | Métadonnées + Open Graph, JSON-LD schema.org, `robots.ts`, `sitemap.ts`, `public/llms.txt`, zones privées en `noindex` |
| Images | Le projet ne contient **aucune balise `<img>`** : le texte alternatif n'est donc requis nulle part pour l'instant. À faire pour toute image future |

## 3. Limites connues (non traitées, à ne pas oublier)

- **Aucun test réel n'a été exécuté** (pas de build Next.js ni de base de données dans mon environnement) :
  vérification limitée à l'analyse syntaxique TypeScript. Lance `pnpm build`, `pnpm lint` et teste l'inscription
  (< 15 ans, 15-17, majeur), le paiement test Stripe et la suppression de compte.
- **Contrastes** : audit chiffré sur les couleurs Tailwind du projet, pas un audit visuel complet (états hover,
  mode sombre, graphiques). Passer un outil (axe, Lighthouse, WAVE) et un test lecteur d'écran.
- **Les accès aux données** : le compte administrateur voit les e-mails des élèves ; prévoir MFA admin, et ne
  jamais utiliser les mots de passe de démonstration (documentés publiquement) en production.
- **Sous-traitants hors UE** (Stripe, Resend, Anthropic) : signer les DPA et vérifier les garanties de transfert.
- **Analyse d'impact (AIPD)** : un service qui traite des données de mineurs à grande échelle peut en exiger une ;
  à évaluer avec un DPO. Registre des traitements (art. 30) à tenir.
- **Fournisseur IA** : tant que `AI_PROVIDER=mock`, rien ne sort du serveur. En activant Anthropic, la politique
  de confidentialité l'indique automatiquement, mais il faut aussi informer l'utilisateur dans le coach.
- Les liens et références légales (articles du Code de la consommation, de la loi Informatique et Libertés,
  fermeture de la plateforme européenne RLL) sont citées de bonne foi : à revérifier à la relecture juridique.

## 4. Vérifications de cohérence texte ↔ code (revue finale)

- Hachage des mots de passe : Argon2id (défaut du module `argon2`) — conforme à la politique de confidentialité.
- Limitation des tentatives : 8 connexions / 15 min par e-mail, 5 inscriptions / h par IP — conforme.
- Espace admin : affiche prénom, e-mail, niveau, formule, statut mineur, échanges du support et journal de sécurité
  (avec IP) — la politique de confidentialité a été corrigée pour le dire exactement.
- Documents : l'envoi est aujourd'hui **simulé** (titre uniquement, pas de fichier ni de contenu stocké). Si l'envoi réel
  est activé (stockage S3/MinIO, découpage en `DocumentChunk`), il faudra : mettre à jour la politique de
  confidentialité, inclure fichiers et chunks dans l'export (`api/account/export`) et dans la suppression du stockage.
