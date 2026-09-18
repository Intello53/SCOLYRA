# Roadmap

## V0 / MVP (fondation posée dans cette génération, partiellement)

- [x] Profil pédagogique (schéma)
- [x] Dashboard (démo statique)
- [x] Coach IA (architecture + mode mock)
- [x] Objectifs (schéma + agent)
- [x] Révisions (schéma + agent)
- [ ] Calendrier (page stub uniquement)
- [x] Mode démo (seed)
- [ ] Authentification réelle (inscription/connexion fonctionnelles)
- [ ] Connexion des pages au vrai contenu de la base (actuellement
      données statiques/démo pour le dashboard, pages stub ailleurs)

## V1

- [ ] Documents : upload réel vers MinIO/S3
- [ ] Pipeline RAG complet (OCR, chunking, embeddings réels, recherche
      sémantique pgvector)
- [ ] Analyse de copies fonctionnelle (CopyAnalysisAgent branché sur un
      vrai provider vision)
- [ ] Suivi de progression détaillé
- [ ] Projets : UI complète (au-delà du schéma)

## V2

- [ ] Orientation avancée
- [ ] Import de formations depuis une source officielle vérifiée
- [ ] Candidatures (UI + suivi de statut)
- [ ] Gamification
- [ ] Notifications (in-app + email via Resend)
- [ ] Stripe Checkout / Billing Portal / webhooks fonctionnels

## V3

- [ ] Intégration Parcoursup (sous réserve d'une source de données
      officielle stable et exploitable)
- [ ] Orientation post-bac avancée
- [ ] Mémoire longue durée du coach IA (historique de conversations
      exploité dans le contexte)

## Non planifié / à trancher

- Choix définitif d'hébergement et de CI/CD (voir DEPLOYMENT.md)
- Choix du rendu markdown pour `/docs` (§35)
