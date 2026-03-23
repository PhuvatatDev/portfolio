# Portfolio PhuvatatDev — Claude Project Context

## Définition du Projet

**Portfolio** professionnel de PhuvatatDev (Phuvatat) — site vitrine pour présenter le profil développeur, les projets réalisés et les compétences techniques. Hébergé sur GitHub Pages.

**Objectif** : Décrocher des missions/emplois en Flutter/Firebase et développement web. Montrer un niveau pro à travers le code du portfolio lui-même + les projets présentés (MindTarot principalement).

**Public cible** : Recruteurs tech, clients potentiels, communauté dev.

---

## Stack Technique

| Outil | Rôle |
|-------|------|
| **Astro 5** | Framework SSG (HTML statique, performance max) |
| **TypeScript** | Typage strict |
| **Tailwind CSS** | Styling utilitaire |
| **GSAP** | Animations scroll + transitions |

**Hébergement** : GitHub Pages (`phuvatatdev.github.io/portfolio`)
**Repo** : `PhuvatatDev/portfolio` (public)
**Node requis** : >= 22.12.0

---

## Architecture Projet

```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/        # Header, Footer, Navigation
│   │   ├── sections/      # Hero, Projects, Skills, About, Contact
│   │   └── ui/            # ProjectCard, SkillBadge, Button, etc.
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro    # Landing page (EN par défaut)
│   ├── styles/
│   │   └── global.css     # Tailwind directives + custom styles
│   ├── i18n/              # Traductions EN/FR
│   └── data/              # Données projets, skills (TypeScript)
├── public/
│   └── images/            # Screenshots, avatar, assets
├── .claude/
│   ├── CLAUDE.md          # Ce fichier
│   └── ROADMAP.md         # Planification
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Règles de Développement

### Code
- ✅ TypeScript strict partout
- ✅ Composants Astro réutilisables (props typées)
- ✅ Tailwind pour le styling — pas de CSS custom sauf nécessité
- ✅ Noms de fichiers : PascalCase pour composants, kebab-case pour pages
- ❌ Pas de framework JS lourd (React, Vue) — Astro islands si besoin d'interactivité
- ❌ Pas de dépendances inutiles — chaque package doit être justifié

### Performance
- ✅ Images optimisées (WebP, lazy loading)
- ✅ Score Lighthouse > 95 sur les 4 métriques
- ✅ Pas de JS côté client sauf GSAP animations
- ✅ Fonts : preload + display swap

### Design
- ✅ Dark theme principal (dev-friendly)
- ✅ Responsive : mobile-first (320px → 1440px)
- ✅ Palette : voir `tailwind.config.mjs` (primary, accent, surface, muted)
- ✅ Typographie : Inter (texte) + JetBrains Mono (code)
- ✅ Clean, minimal, pas de bloat visuel

### i18n
- ✅ EN par défaut (marché international)
- ✅ FR disponible
- ✅ Système simple : fichiers JSON dans `src/i18n/`

---

## Sections du Site

| Section | Contenu |
|---------|---------|
| **Hero** | Nom, titre, tagline, CTA (contact / voir projets) |
| **Projects** | MindTarot (featured) + autres projets |
| **Skills** | Stack technique avec niveaux |
| **About** | Parcours, localisation, ambitions |
| **Contact** | Email, GitHub, Instagram |

---

## Projet Featured : MindTarot

Le repo MindTarot est **privé**. Le portfolio doit montrer :
- Screenshots (ceux des stores, déjà existants)
- Features clés + stack technique
- Métriques (18 CF, 371 tests, 3 langues, 177 pays)
- Lien Google Play Store
- Architecture (Clean Architecture diagram)

---

## Commandes

```bash
npm run dev       # Dev server (localhost:4321)
npm run build     # Build statique → dist/
npm run preview   # Preview du build
```

### Déploiement GitHub Pages
Le déploiement se fait via GitHub Actions (workflow à configurer).

---

*Last Updated: 2026-03-23*
