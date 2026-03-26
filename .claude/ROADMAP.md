# Portfolio PhuvatatDev — Roadmap

## Objectif
Site portfolio pro avec scroll animé (pattern MindTarot) sur GitHub Pages.

## Phase 1 — Setup
**Statut** : ✅ Terminé

- [x] Créer structure projet (Astro + Tailwind + GSAP + TypeScript)
- [x] `.claude/` docs (CLAUDE.md, ROADMAP.md, WEBSITE_SPEC.md, DESIGN_DIRECTION.md, CONTENT.md, WHO_I_AM.md, MINDTAROT_FEATURES.md)
- [x] Repo GitHub (`PhuvatatDev/portfolio`)
- [x] `npm install` (Node 20 compatible)
- [x] Vérifier `npm run dev` fonctionne

---

## Phase 2 — Copie & Adaptation Base MindTarot + Header/Hero
**Statut** : ✅ Terminé

- [x] Copier assets depuis `mindtarot/website/` (phone-frame, badges, rotate-phone.lottie, screenshots)
- [x] Copier et adapter `BaseLayout.astro` (meta SEO, fonts DM Serif + Chivo Mono, landscape overlay)
- [x] Copier et adapter `Header.astro` (logo PhuvatatDev., nav crochets `[ ]`, progress bar jaune)
- [x] Copier et adapter `CodeGrid.astro` (ex CalendarGrid — snippets code au lieu de tarot)
- [x] Copier et adapter `scroll-controller.ts` (parallaxe grille, hero fade-out, progress bar)
- [x] Configurer `tailwind.config.mjs` (palette menthe + jaune, breakpoint 1180px)
- [x] Configurer `global.css` (Tailwind directives, base styles)
- [x] Page `index.astro` avec Header + Hero + CodeGrid assemblés
- [x] `Hero.astro` — tagline serif, sous-texte, CTA boutons `[ see my work ]` `[ get in touch ]`
- [x] Animation hero text fade-out au scroll (0-5%)

---

## Phase 3 — My Work (section unique, 2 animations + marquee)
**Statut** : 🔨 En cours (Animation 1 + Marquee ✅, Animation 2 ✅ structure, vidéo phone en attente)
**Assets** : ✅ Illustrations + logos tech téléchargés

### Assets disponibles
- 4 illustrations Storyset (charbon/N&B) : `public/images/illustrations/step-{idea,discussion,build,live}.svg`
- 12 logos tech (couleur) : `public/images/logos/` (flutter, dart, firebase, gemini, anthropic, claude, git, typescript, astro, codemagic, revenuecat, stripe)

### Animation 1 — Carte processus (4 étapes)
- [x] Illustrations éparpillées dans le Hero (pas dans l'ordre)
- [x] Au scroll : illustrations convergent dans une **carte crème** `#F5F3EF` (4 blocs dans l'ordre)
- [x] Labels + descriptions sous chaque étape (Idea, Discussion, Build, Live)
- [x] Hero text sort à gauche au scroll (fixed + x: -100vw)
- [x] Label `[ how it works ]` sur la carte

### Marquee Tech Stack
- [x] **Marquee horizontal** avec logos tech en défilement infini
- [x] Logos N&B par défaut (CSS filter grayscale) → couleur au hover
- [x] Placement : sous la carte processus, label `[ what I use ]`

### Animation 2 — Phone Showcase MindTarot
- [x] Carte processus + illustrations sortent vers le haut ensemble
- [x] Phone monte depuis le bas, se décale à gauche
- [x] Panel crème Stytch-style slide in à droite (grille 8 cartes techniques)
- [x] `FeatureCard.astro` composant réutilisable (titre + description + visuel + expand)
- [x] Cartes cliquables → vue détaillée dans le même container (taille fixe)
- [x] `feature-panel.ts` module séparé pour la logique d'interaction
- [x] Store badges (Google Play actif, Apple Store grisé)
- [x] Header slide-up quand phone arrive (-5vw)
- [x] Responsive desktop phone+panel (22vw phone, calc panel, tested 1180-1920px)
- [x] Fix scroll jump on scroll-back (refresh cascade fix)
- [x] Clean Architecture : skeleton vérifié depuis repo MindTarot, couleurs layers, vrai DrawCubit
- [ ] **Contenu cartes** : passer les 7 cartes restantes (AI, Security, Auth, Payments, State, Chat, i18n)
- [ ] **Contenu détails** : texte + code vérifiés depuis repo MindTarot pour chaque carte
- [ ] Vidéo screen recording dans le phone (en attente de l'asset)
- [ ] QR codes stores (en bas du panel)

---

## Phase 4 — Skills
**Statut** : 📋 À faire

- [ ] **Skills** : JSON-style monospace ou liste structurée

---

## Phase 5 — About + Contact
**Statut** : 📋 À faire

- [ ] **About** : parcours autodidacte (texte direct, 3-5 lignes) + code accent `class Phuvatat {}`
- [ ] **Contact** : terminal style, email, GitHub
- [ ] **Other Projects** : MindTarot site, Lead magnet, Flutter Study (optionnel)

---

## Phase 6 — Animations & Polish
**Statut** : 📋 À faire

- [ ] Scroll animations complètes (toutes les phases synchronisées)
- [ ] Transition crème → pistache fluide
- [ ] Grille de fond avec parallaxe
- [ ] Responsive complet (mobile-first, svh units)
- [ ] Score Lighthouse > 95

---

## Phase 7 — Assets & SEO
**Statut** : 📋 À faire

- [ ] Screenshots MindTarot optimisés (WebP, < 200KB)
- [ ] Favicon + OG meta (preview liens sociaux)
- [ ] i18n FR
- [ ] SEO (sitemap, meta descriptions)
- [ ] GitHub Actions workflow pour déploiement Pages

---

## Phase 8 — GitHub Profile
**Statut** : 📋 Plus tard

- [ ] Profile README (`PhuvatatDev/PhuvatatDev`)
- [ ] Repo `mindtarot-showcase` (README public du projet privé)
- [ ] Pinned repos + bio GitHub

---

*MAJ : 2026-03-26*
