# Portfolio PhuvatatDev — Spécification Website

**Date** : 2026-03-25
**Statut** : Phase 3 en cours (Animation 1 + Marquee ✅, Animation 2 Phone + Panel technique ✅, vidéo en attente)
**MAJ** : 2026-03-26
**Source** : Pattern copié du site MindTarot (`mindtarot/website/`), code stable de référence

---

## 1. Objectif

Site portfolio professionnel avec scroll animé (même pattern que le site MindTarot). Présenter le profil dev, MindTarot comme featured project (cadre téléphone + screenshots défilants), les compétences techniques. Convaincre un recruteur/client en 30 secondes.

---

## 2. Stack Technique

| Outil | Rôle | Référence MindTarot |
|-------|------|---------------------|
| **Astro 5** | Framework SSG | Même version |
| **TypeScript** | Typage strict | Même |
| **Tailwind CSS 3** | Styling utilitaire | Même |
| **GSAP 3 + ScrollTrigger** | Scroll animé | `scroll-controller.ts` (745 lignes) |
| **Lottie** | Animation rotate phone (landscape) | `rotate-phone.lottie` |

**Hébergement** : GitHub Pages (`phuvatatdev.github.io/portfolio`)
**Code source de référence** : `C:\Users\szent\Repositories\mindtarot\website\`

---

## 3. Architecture Projet

```
portfolio/
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   └── scroll-controller.ts   # Adapté de mindtarot/website
│   │   ├── layout/
│   │   │   └── Header.astro           # Adapté (logo Phuvatat, nav crochets)
│   │   ├── sections/
│   │   │   ├── CodeGrid.astro         # Adapté de CalendarGrid.astro
│   │   │   ├── Hero.astro             # Nouveau (nom, tagline, code accent)
│   │   │   ├── About.astro            # Nouveau
│   │   │   ├── MindTarot.astro        # Adapté de PhoneShowcase.astro
│   │   │   ├── Skills.astro           # Nouveau
│   │   │   └── Contact.astro          # Adapté de Cta.astro
│   │   └── ui/
│   │       ├── FeatureBlock.astro     # Copié de mindtarot/website
│   │       ├── SectionTitle.astro     # Nouveau (crochets [ ])
│   │       └── StoreBadges.astro      # Copié de mindtarot/website
│   ├── layouts/
│   │   └── BaseLayout.astro           # Adapté (meta SEO portfolio, fonts)
│   ├── pages/
│   │   └── index.astro                # Page unique
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── profile.ts
│   │   └── code-snippets.ts           # Snippets pour CodeGrid
│   ├── i18n/
│   │   ├── en.ts
│   │   ├── fr.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── global.css
├── public/
│   ├── images/
│   │   ├── phone-frame.png            # Copié de mindtarot/website
│   │   ├── screenshots/               # Screenshots MindTarot
│   │   │   ├── en/
│   │   │   └── fr/
│   │   ├── badge-app-store.svg        # Copié
│   │   ├── badge-google-play.png      # Copié
│   │   ├── illustrations/          # 4 SVG Storyset (idée/discussion/build/live)
│   │   ├── logos/                  # 10 SVG logos tech (flutter, firebase, etc.)
│   │   ├── og-image.png
│   │   └── favicon.svg
│   └── animations/
│       └── rotate-phone.lottie        # Copié
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 4. Correspondance MindTarot → Portfolio

### Fichier par fichier — ce qu'on copie, ce qu'on adapte

| Fichier MindTarot (source) | Fichier Portfolio | Action |
|---------------------------|-------------------|--------|
| `components/animations/scroll-controller.ts` | `scroll-controller.ts` | **Adapter** — phases portfolio, 2 color phases (crème→menthe) |
| `components/sections/CalendarGrid.astro` | `CodeGrid.astro` | **Adapter** — snippets code au lieu de noms tarot |
| `components/sections/Hero.astro` | `Hero.astro` | **Réécrire** — nom + tagline + code accent (pas de cartes tarot) |
| `components/sections/PhoneShowcase.astro` | `MindTarot.astro` | **Adapter** — même phone frame + screenshots |
| `components/sections/Cta.astro` | `Contact.astro` | **Adapter** — contact terminal style |
| `components/layout/Header.astro` | `Header.astro` | **Adapter** — logo Phuvatat, nav crochets `[ ]` |
| `components/ui/FeatureBlock.astro` | `FeatureBlock.astro` | **Copier** tel quel |
| `components/ui/StoreBadges.astro` | `StoreBadges.astro` | **Copier** tel quel |
| `layouts/BaseLayout.astro` | `BaseLayout.astro` | **Adapter** — meta portfolio, fonts DM Serif + Chivo Mono |
| `styles/global.css` | `global.css` | **Adapter** — couleurs portfolio |
| `i18n/index.ts` | `index.ts` | **Adapter** — EN/FR (pas RU) |
| `tailwind.config.mjs` | `tailwind.config.mjs` | **Adapter** — couleurs portfolio |

### Assets copiés directement

| Asset source (`mindtarot/website/public/`) | Destination (`portfolio/public/`) |
|-------------------------------------------|-----------------------------------|
| `images/phone-frame.png` | `images/phone-frame.png` |
| `images/badge-app-store.svg` | `images/badge-app-store.svg` |
| `images/badge-google-play.png` | `images/badge-google-play.png` |
| `animations/rotate-phone.lottie` | `animations/rotate-phone.lottie` |
| `images/en/screenshot-*.webp` | `images/screenshots/en/` |
| `images/fr/screenshot-*.webp` | `images/screenshots/fr/` |

---

## 5. Sections de la Landing Page

| # | Section | Contenu | Code accent |
|---|---------|---------|-------------|
| 1 | **Hero** | Tagline, CTA, illustrations éparpillées (4 étapes, pas dans l'ordre) | — |
| 2 | **My Work** | Section unique avec 2 animations : (1) illustrations convergent → carte crème 4 étapes, (2) carte sort → phone MindTarot monte avec showcase | Structure Clean Architecture |
| 3 | **Skills** | Stack technique | JSON-style monospace |
| 4 | **About** | Parcours autodidacte (3-5 lignes) | `class Phuvatat { }` monospace |
| 5 | **Contact** | Email, GitHub | Terminal style |

---

## 6. Design System

### Palette de couleurs (transition au scroll)

Le fond passe de **crème** à **vert menthe** pendant le scroll.

| Phase scroll | Couleur | Hex | Opacité |
|-------------|---------|-----|---------|
| Phase 1 (0-40%) | Blanc cassé | `#F5F3EF` | fond principal |
| Transition (40-60%) | Pistache pâle | `#E8EDDF` | crossfade |
| Phase 2 (60-100%) | Vert menthe | `#B8F0C8` | fond principal |

**Transition** (même pattern que MindTarot) :
1. Couleur actuelle **s'assombrit** (luminosité baisse)
2. Nouvelle couleur apparaît **en version sombre**
3. Nouvelle couleur **s'éclaircit** jusqu'à sa teinte finale

Pas de changement brutal. GSAP ScrollTrigger interpole la luminosité HSL.

### Couleurs complètes (Tailwind config)

| Rôle | Hex | Usage |
|------|-----|-------|
| **Accent** (menthe) | `#B8F0C8` | Highlights, crochets, syntax, boutons, liens |
| **Text** (charbon) | `#1A1A1A` | Texte principal |
| **Text secondary** (gris chaud) | `#8A8A7A` | Labels, secondaire |
| **Background start** (blanc cassé) | `#F5F3EF` | Fond initial |
| **Background mid** (menthe pâle) | `#E8EDDF` | Transition |
| **Background end** (menthe) | `#B8F0C8` | Fond final |
| **Terminal cells** (charbon profond) | `#1C1C1C` | Cellules sombres grille |
| **Hover** (vert profond) | `#5C7A3A` | Hover, liens actifs |

### Typographie

- **Serif bold** : DM Serif Display — headings principaux
- **Monospace** : Chivo Mono — nav, boutons, labels, code, crochets
- Deux fonts seulement. Pas de sans-serif.

### Responsive

| Breakpoint | Largeur | Cible |
|-----------|---------|-------|
| Mobile | < 1180px | Tout en dessous |
| Desktop | ≥ 1180px | Layout complet |

Mobile-first. Breakpoint custom `lg: 1180px` (même que MindTarot).

---

## 7. Fond — Grille Code (adapté de CalendarGrid)

### Source : `mindtarot/website/src/components/sections/CalendarGrid.astro` (135 lignes)

### Concept

Même grille procédurale que MindTarot, mais avec du **code** au lieu de noms de cartes de tarot.

### Adaptation

| Élément | MindTarot | Portfolio |
|---------|-----------|----------|
| Texte dans les cellules | Noms d'arcanes majeurs ("I · Le Bateleur") | Snippets code/terminal |
| Opacité texte | 0.35 | 0.35 (même) |
| Cellules sombres | `#1C1C1C` ~10% | `#1C1C1C` ~10% — style terminal |
| Couleur overlay | 4 phases (cha-thai/beige/teal/mauve) | 2 phases (crème→menthe) |
| Parallaxe | Grille translate verticalement via GSAP | Même |

### Contenu des cellules sombres (style terminal)

Snippets décoratifs en opacité basse — pas lisibles en détail, juste l'ambiance :

```
// Exemples de texte dans les cellules :
"class Phuvatat"
"data/ domain/ presentation/"
"flutter build appbundle"
"git commit -m 'ship it'"
"final philosophy = 'Build it yourself'"
"implements Repository"
"Cloud Functions"
"npm run deploy"
"Clean Architecture"
"async function onRequest()"
```

### Paramètres (identiques à MindTarot)

- **6 colonnes** avec ratios [1, 4, 3, 2, 3, 2]
- **Hauteur totale** : 8000px
- **Cellules sombres** : ~10% des cellules, espacement minimum 5
- **PRNG seedé** (seed=42) : résultat déterministe
- **Lignes verticales** : 5 dividers à 8%, 28%, 48%, 68%, 85%
- **Overlay couleur fixe** (`grid-color-overlay`) pour les transitions

---

## 8. Section Hero

### Contenu

- **Tagline** (serif bold, bottom-left) : "I build products from architecture to deployment."
- **Sous-texte** : "Flutter · Firebase · Clean Architecture"
- **CTA** : `[ see my work ]` → scroll vers My Work | `[ get in touch ]` → scroll vers Contact
- **Illustrations éparpillées** : 4 illustrations Storyset dispersées sur l'écran (pas dans l'ordre). Même concept que les cartes de tarot dans le Hero du site MindTarot.

### Animation

- Texte fade-in au chargement
- Au scroll : texte hero fade out (0-5%)
- Les illustrations restent visibles (elles convergent dans la section My Work)

---

## 9. Section About (après Skills, avant Contact)

### Contenu

Voir `CONTENT.md` pour le texte exact. Texte direct, 4 paragraphes courts.

### Code accent `class Phuvatat {}` (déplacé depuis le Hero)

### Animation

- Texte reveal au scroll (fade-in progressif)

---

## 10. Section My Work (section unique, 2 animations)

Section unique regroupant le **processus de travail** et le **showcase MindTarot**.
Même pattern que le site MindTarot (cartes → phone), adapté : illustrations → carte crème → phone.

### Animation 1 — Carte processus

Les 4 illustrations (éparpillées depuis le Hero) **convergent au scroll** et se placent dans l'ordre dans une **carte fond crème** (inspiré stytch.com).

| # | Étape | Description | Badges tech (fade-in) |
|---|-------|-------------|----------------------|
| 1 | **Idée** | Le client a une idée d'app | — |
| 2 | **Discussion** | On discute et on se met d'accord | — |
| 3 | **Build** | Je transforme l'idée en app | `[ Flutter ]` `[ Firebase ]` `[ Claude Code ]` `[ Clean Architecture ]` |
| 4 | **Live** | L'app est publiée sur les stores | `[ Google Play ]` `[ Apple Store ]` `[ Web ]` |

**Illustrations** : 4 SVG Storyset (charbon/N&B), dans `public/images/illustrations/step-{idea,discussion,build,live}.svg`

### Badges tech — comportement hover

- **Par défaut** : texte monospace charbon entre crochets `[ Flutter ]`
- **Au hover** : le vrai logo SVG en couleur apparaît (crossfade)
- **Technique** : conteneur taille fixe, texte mono + icône superposés. CSS `filter: grayscale(1) brightness(0.2)` → `filter: none` avec `transition: filter 0.3s`
- **Pas de saut de dimension** au hover

### Marquee Tech Stack

Bandeau horizontal avec les 10 logos tech qui défilent en boucle infinie.
- **Logos** : `public/images/logos/` (flutter, dart, firebase, gemini, anthropic, git, typescript, astro, codemagic, revenuecat)
- **Par défaut** : N&B (CSS filter grayscale)
- **Au hover** : couleur originale révélée
- **Placement** : après la carte processus ou sous le phone showcase (à valider visuellement)

### Animation 2 — Phone Showcase MindTarot

La carte crème **se déplace / sort** → le **cadre téléphone monte** depuis le bas.
Enchaînement : "voilà comment je travaille" → "voilà le résultat concret" (MindTarot).

**Source** : `mindtarot/website/src/components/sections/PhoneShowcase.astro`

Le phone est **fixed** au centre, les screenshots défilent au scroll, les feature blocks texte scrollent à côté.

### Screenshots à montrer

| # | Feature | Screenshot | Ce que ça prouve |
|---|---------|-----------|-----------------|
| 1 | Home | screenshot-home | Design UI/UX complet |
| 2 | Draw | screenshot-draws | Interactivité, animations |
| 3 | Interpretation | screenshot-interpretation | Intégration IA (Gemini) |
| 4 | Chat | screenshot-chat | Chat IA post-tirage |
| 5 | Journal | screenshot-journal | Persistance, CRUD |
| 6 | Ambiance | screenshot-ambiance | Audio spatial, UX immersive |

### Layout phone (identique à MindTarot)

**Desktop (≥ 1180px)** :
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  LABEL                ┌─────────┐    Titre bold      │
│  (ÉNORME,             │         │    Ce que ça        │
│   bold,               │  PHONE  │    prouve           │
│   sticky)             │ (fixed) │    (scrolle)        │
│                       │         │                     │
│                       └─────────┘                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Badges stores (sous le phone showcase)

- `[ view on Google Play → ]` — actif
- `[ Apple Store — coming soon ]` — grisé

### Code accent Clean Architecture

```
lib/features/draw/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── usecases/
│   └── repositories/
└── presentation/
    ├── cubits/
    ├── pages/
    └── widgets/
```

---

## 11. Section Skills

### Contenu

Voir `CONTENT.md` pour le détail. Présenté en JSON-style monospace ou liste structurée.

### Animation

- Reveal progressif au scroll

---

## 12. Section Contact

### Source : adapté de `mindtarot/website/src/components/sections/Cta.astro`

### Contenu (terminal style)

```
> phuvatat.contact("your-message")

  email    → phuvatat.dev@gmail.com
  github   → github.com/PhuvatatDev
  play     → MindTarot on Google Play
```

### CTA : `[ send a message ]` → mailto

---

## 13. Fin du Scroll — Outro

### Concept

Le phone monte et sort par le haut → transition vers la section Contact/CTA.

Pas de reverse animation de cartes (pas de cartes dans le portfolio). Transition simple : phone out → CTA fade in.

---

## 14. Workflow de Développement

### Règles (identiques à MindTarot)

- **Une tâche à la fois** — pas de parallélisme sur les couches visuelles
- **Tu valides visuellement** avant qu'on avance
- **Assets manquants** → placeholders puis remplacement
- **Ajustements** → positions, tailles, timings dans la config → facile à tweaker

### Début de session

1. Claude lit `WEBSITE_SPEC.md`
2. Vérifie la progression (quelle phase, quelle tâche)
3. On reprend là où on s'est arrêté

### Pendant la session

1. Claude code la tâche en cours
2. Tu vérifies sur `localhost:4321`
3. **OK** → tâche suivante, Claude coche
4. **Pas OK** → tu décris, on ajuste

### Fin de session

1. Claude met à jour la progression
2. Commit du travail fait

---

## 15. Plan de Tâches — Phase par Phase

Chaque tâche produit un **résultat visible dans le navigateur**. On teste visuellement avant de passer à la suivante.

**Référence code** : chaque phase indique le fichier MindTarot source à copier/adapter.

---

### Phase 0 — Setup Projet
> **Test** : page blanche visible sur localhost
> **Statut** : ✅ Terminé

| # | Tâche | Test visuel |
|---|-------|-------------|
| 0.1 | ✅ Init Astro + Tailwind + GSAP + TypeScript | `npm run dev` → page s'affiche |
| 0.2 | ✅ Docs `.claude/` (CLAUDE.md, ROADMAP.md, WEBSITE_SPEC.md, etc.) | — |

---

### Phase 1 — Fond Grille Code
> **Test** : fond grille visible en plein écran, scrollable, couleurs qui changent
> **Source MindTarot** : `CalendarGrid.astro` (135 lignes) + `scroll-controller.ts` (section color phases)

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 1.1 | Copier assets (phone-frame, badges, lottie, screenshots) depuis `mindtarot/website/public/` | Fichiers présents dans `public/` | Assets directs |
| 1.2 | `BaseLayout.astro` — HTML head, meta SEO, fonts (DM Serif + Chivo Mono), landscape overlay | Titre "Phuvatat" dans l'onglet, fonts chargées | `BaseLayout.astro` |
| 1.3 | `tailwind.config.mjs` — couleurs portfolio, breakpoint 1180px | — (config) | `tailwind.config.mjs` |
| 1.4 | `global.css` — Tailwind directives, base styles | — (config) | `global.css` |
| 1.5 | `CodeGrid.astro` — grille procédurale avec snippets code (au lieu de tarot) | Grille visible, bordures subtiles, cellules sombres avec code | `CalendarGrid.astro` |
| 1.6 | Première couleur de fond : blanc cassé `#F5F3EF` | Fond crème, cases subtiles | — |
| 1.7 | La page est assez haute pour scroller (placeholder height) | On peut scroller | — |
| 1.8 | `scroll-controller.ts` — setup GSAP + transition couleur au scroll (crème → menthe) | Les couleurs changent en scrollant | `scroll-controller.ts` (lignes color phases) |
| 1.9 | Effet assombrissement/éclaircissement entre transitions | Transition douce, pas de coupure | `scroll-controller.ts` |
| 1.10 | Parallaxe grille (translate vertical via GSAP) | La grille bouge plus lentement que le scroll | `scroll-controller.ts` |

---

### Phase 2 — Header + Hero
> **Test** : hero complet visible sans scroll
> **Source MindTarot** : `Header.astro` (logo + progress bar)

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 2.1 | `Header.astro` — logo "Phuvatat" fixe + nav crochets `[ about ] [ work ] [ skills ] [ contact ]` + progress bar | Logo en haut, nav visible, progress bar au scroll | `Header.astro` |
| 2.2 | `Hero.astro` — tagline (serif), sous-texte, CTA boutons + illustrations éparpillées (placeholders) | Texte lisible sur fond grille, illustrations visibles | Nouveau |
| 2.3 | Animation hero text fade-out au scroll (0-5%) | Le texte hero disparaît en scrollant | `scroll-controller.ts` |

---

### Phase 3 — My Work (section unique, 2 animations)
> **Test** : scroller → illustrations convergent dans carte crème → carte sort → phone monte → screenshots défilent
> **Source MindTarot** : `PhoneShowcase.astro` + `FeatureBlock.astro` + `scroll-controller.ts`

**Animation 1 — Carte processus :**

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 3.1 | Illustrations Storyset intégrées (4 images, éparpillées dans le Hero) | 4 illustrations visibles dans le Hero | Nouveau (même pattern que cartes tarot) |
| 3.2 | Carte crème container (fond `#F5F3EF`, rounded, centré) | Carte visible au centre | Nouveau (inspiré stytch.com) |
| 3.3 | Animation convergence : illustrations se placent dans la carte dans l'ordre (4 étapes) | Au scroll, les illustrations se rassemblent | `scroll-controller.ts` (même pattern que cartes → phone) |
| 3.4 | Badges tech fade-in dans Build (`[ Flutter ]` `[ Firebase ]` `[ Claude Code ]` `[ Clean Archi ]`) et Live (`[ Google Play ]` `[ Apple Store ]` `[ Web ]`) | Badges apparaissent dans les cases | Nouveau |
| 3.5 | Badges : texte mono charbon par défaut → hover révèle logo SVG couleur (conteneur fixe, crossfade, pas de saut) | Hover fonctionne sans saut | Nouveau |

**Marquee Tech Stack :**

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 3.6 | Marquee horizontal avec 10 logos tech en défilement infini | Logos défilent en boucle | Nouveau |
| 3.7 | Logos N&B par défaut (CSS filter grayscale) → couleur au hover | Hover révèle les couleurs | Nouveau |

**Animation 2 — Phone Showcase MindTarot :**

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 3.8 | Carte crème se déplace / sort | La carte sort de l'écran | `scroll-controller.ts` |
| 3.9 | Phone container (fixed, centré) + phone-frame.png | Cadre téléphone visible au centre | `Hero.astro` (#phone-container) |
| 3.10 | Phone monte du bas au scroll | Le phone apparaît depuis le bas | `scroll-controller.ts` (phone rise) |
| 3.11 | Screenshots chargés dans le phone (5-6 images empilées) | Images dans le DOM | `PhoneShowcase.astro` |
| 3.12 | Screenshot slide up au scroll (driven par les text blocks) | Nouveau screenshot monte depuis le bas | `scroll-controller.ts` (showcase) |
| 3.13 | Fade-out ancien screenshot (overlap, pas écran noir) | Transition fluide | `scroll-controller.ts` |
| 3.14 | `FeatureBlock.astro` — blocs texte à droite (titre + description × 5-6) | Texte visible, scrolle naturellement | `FeatureBlock.astro` |
| 3.15 | Label ÉNORME fixe à gauche (change par feature avec fade) | Grand mot à gauche, change | `scroll-controller.ts` (label) |
| 3.16 | Store badges (Google Play actif, Apple Store grisé) | Boutons visibles | `StoreBadges.astro` |
| 3.17 | Code accent Clean Architecture (monospace) | Snippet structure visible | Nouveau |

---

### Phase 4 — Skills
> **Test** : section Skills visible au scroll

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 4.1 | `Skills.astro` — JSON-style ou liste structurée (voir CONTENT.md) | Compétences lisibles | Nouveau |
| 4.2 | Animation reveal au scroll | Apparition progressive | `scroll-controller.ts` |

---

### Phase 5 — About
> **Test** : section About visible au scroll après Skills, avant Contact

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 5.1 | `About.astro` — texte parcours autodidacte (voir CONTENT.md) | Texte lisible, bien espacé | Nouveau |
| 5.2 | Code accent `class Phuvatat {}` (monospace, décoratif) | Terminal visible | Nouveau |
| 5.3 | Animation reveal au scroll | Le texte apparaît progressivement | `scroll-controller.ts` |

---

### Phase 6 — Contact + Outro
> **Test** : section Contact visible, phone sort par le haut
> **Source MindTarot** : `Cta.astro` + `scroll-controller.ts` (outro timeline)

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 6.1 | Phone monte et sort par le haut | Le phone disparaît vers le haut | `scroll-controller.ts` (outro) |
| 6.2 | `Contact.astro` — terminal style (email, GitHub) | Contact visible | `Cta.astro` |
| 6.3 | CTA `[ send a message ]` | Bouton fonctionnel | Nouveau |
| 6.4 | Copyright + liens | Footer intégré | `Cta.astro` |

---

### Phase 7 — i18n (EN/FR)
> **Test** : switcher langue fonctionne, tous les textes changent
> **Source MindTarot** : `i18n/index.ts` + `en.ts` + `fr.ts`

| # | Tâche | Test visuel | Source MindTarot |
|---|-------|-------------|-----------------|
| 7.1 | Fichiers i18n (`en.ts`, `fr.ts`) avec toutes les strings | — | `i18n/` |
| 7.2 | Système détection langue + localStorage | Langue du navigateur détectée | `i18n/index.ts` |
| 7.3 | Switcher dans le header (EN/FR) | Clic change la langue | `Header.astro` |
| 7.4 | Textes dynamiques (data-i18n) | Tout change au switch | `i18n/index.ts` |
| 7.5 | Screenshots changent selon la langue | EN/FR cohérents | `scroll-controller.ts` |

---

### Phase 8 — Mobile Responsive
> **Test** : le site fonctionne sur 412px (Android standard)
> **Source MindTarot** : `global.css` (media queries) + `scroll-controller.ts` (isMobile)
> **Breakpoint** : `< 1180px`
> **Règle** : ZERO changement desktop. On AJOUTE du mobile.

#### Étape A — Hero mobile

| # | Tâche | Test visuel (412px) |
|---|-------|---------------------|
| A1 | Hero texte pleine largeur, lisible | Nom + tagline lisibles |
| A2 | Header adapté (logo + nav) | Logo + nav fonctionnels |
| A3 | Code accent responsive | Snippet lisible ou masqué |

#### Étape B — Showcase mobile

| # | Tâche | Test visuel |
|---|-------|-------------|
| B1 | Phone centré, ~85vw | Phone visible, bonne taille |
| B2 | Feature blocks sous le phone, fond opaque `--phase-bg` | Texte lisible par-dessus le phone |
| B3 | Label feature intégré dans le bloc texte | Pas de label séparé |
| B4 | Screenshots changent au scroll | Transitions fonctionnelles |

#### Étape C — Sections mobiles

| # | Tâche | Test visuel |
|---|-------|-------------|
| C1 | About responsive | Texte lisible |
| C2 | Skills responsive | Liste/JSON lisible |
| C3 | Contact responsive | Terminal lisible, boutons full width |

#### Étape D — Polish mobile

| # | Tâche | Test visuel |
|---|-------|-------------|
| D1 | Test scroll complet mobile (début → fin, aller-retour) | Pas de bugs |
| D2 | Test 2 langues (EN/FR) mobile | Tout change correctement |
| D3 | Landscape overlay (rotate-phone.lottie) | Message "rotate" visible en paysage |

---

### Phase 9 — Polish & SEO
> **Test** : site complet, performant, SEO OK

| # | Tâche | Test visuel |
|---|-------|-------------|
| 9.1 | Test complet desktop (scroll A→Z, 2 langues) | Tout fonctionne |
| 9.2 | Performance (images WebP < 200KB, fonts optimisées) | Chargement rapide |
| 9.3 | SEO (meta OG/Twitter, favicon, sitemap) | Previews sociaux OK |
| 9.4 | Lighthouse > 95 (4 métriques) | Scores verts |
| 9.5 | GitHub Actions workflow pour GitHub Pages | Deploy automatique |

---

### Phase 10 — Other Projects (optionnel)
> Si on veut ajouter les projets secondaires

| # | Tâche | Test visuel |
|---|-------|-------------|
| 10.1 | Section Other Projects (MindTarot site, Lead magnet, Flutter Study) | Cartes simples visibles |
| 10.2 | Intégration dans le scroll | Transition fluide |

---

**Progression : Phase 0-2 ✅ — Phase 3 en cours (Animation 1 + Marquee ✅, Animation 2 Phone + Panel ✅, vidéo en attente)**

---

*Document créé le 2026-03-25 — basé sur WEBSITE_SPEC.md de MindTarot*
