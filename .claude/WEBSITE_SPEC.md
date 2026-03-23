# Portfolio PhuvatatDev — Spécification Website

**Date** : 2026-03-23
**Statut** : Phase 1 (Setup)
**MAJ** : 2026-03-23

---

## 1. Objectif

Site portfolio professionnel — présenter le profil dev, les projets (MindTarot featured), les compétences techniques. Doit convaincre un recruteur/client en 30 secondes.

---

## 2. Stack Technique

| Outil | Rôle |
|-------|------|
| **Astro 5** | Framework SSG (HTML statique, 0 JS par défaut) |
| **TypeScript** | Typage strict partout |
| **Tailwind CSS 3** | Styling utilitaire |
| **GSAP** | Animations scroll + transitions |

**Hébergement** : GitHub Pages (`phuvatatdev.github.io/portfolio`)
**Repo** : `PhuvatatDev/portfolio` (public)

---

## 3. Architecture Projet — Clean Architecture Web

### Principes

La même logique que Clean Architecture Flutter appliquée au web :
- **Séparation des responsabilités** : chaque dossier a UN rôle clair
- **Dépendances unidirectionnelles** : `pages` → `sections` → `ui` (jamais l'inverse)
- **Données séparées de la présentation** : contenu dans `data/`, pas hardcodé dans les composants
- **Types centralisés** : interfaces TypeScript dans `types/`
- **i18n isolé** : traductions dans `i18n/`, jamais de texte hardcodé dans les composants

### Arbre de fichiers

```
portfolio/
├── src/
│   ├── components/
│   │   ├── layout/            # Structure de page (squelette)
│   │   │   ├── Header.astro       # Nav sticky + logo + liens
│   │   │   └── Footer.astro       # Liens sociaux + copyright
│   │   │
│   │   ├── sections/          # Blocs de contenu (une section = un sujet)
│   │   │   ├── Hero.astro         # Intro : nom, titre, tagline, CTA
│   │   │   ├── Projects.astro     # Grille/liste de projets
│   │   │   ├── Skills.astro       # Stack technique + niveaux
│   │   │   ├── About.astro        # Parcours, localisation, ambitions
│   │   │   └── Contact.astro      # Email, GitHub, Instagram
│   │   │
│   │   ├── ui/                # Composants réutilisables (atomes)
│   │   │   ├── Button.astro       # Bouton CTA (variants: primary, outline, ghost)
│   │   │   ├── ProjectCard.astro  # Carte projet (screenshot, titre, stack, lien)
│   │   │   ├── SkillBadge.astro   # Badge compétence (icône + label)
│   │   │   ├── SocialLink.astro   # Lien social (icône + URL)
│   │   │   └── SectionTitle.astro # Titre de section (h2 + trait décoratif)
│   │   │
│   │   └── animations/        # Scripts d'animation (client-side)
│   │       └── scroll-reveal.ts   # GSAP ScrollTrigger — reveal au scroll
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro   # HTML head, meta SEO, fonts, Tailwind, OG tags
│   │
│   ├── pages/
│   │   └── index.astro        # Page unique — assemble les sections
│   │
│   ├── data/                  # Contenu pur (AUCUN markup, AUCUN style)
│   │   ├── projects.ts            # Liste des projets (titre, description, stack, liens, screenshots)
│   │   ├── skills.ts              # Stack technique (catégories + items)
│   │   └── profile.ts             # Infos perso (nom, titre, bio, liens sociaux)
│   │
│   ├── i18n/                  # Traductions
│   │   ├── en.ts                  # Anglais (défaut)
│   │   ├── fr.ts                  # Français
│   │   └── index.ts               # Helper getLang() + t()
│   │
│   ├── types/                 # Interfaces TypeScript
│   │   └── index.ts               # Project, Skill, Profile, SocialLink, etc.
│   │
│   ├── styles/
│   │   └── global.css         # @tailwind directives + custom utilities + fonts
│   │
│   └── utils/                 # Helpers purs (si besoin)
│       └── (vide pour l'instant)
│
├── public/
│   ├── images/
│   │   ├── projects/              # Screenshots par projet (mindtarot/, etc.)
│   │   ├── avatar.webp            # Photo/avatar pro
│   │   └── og-image.png           # Preview liens sociaux (1200×630)
│   ├── fonts/                     # Polices custom (si pas Google Fonts CDN)
│   └── favicon.svg
│
├── .claude/
│   ├── CLAUDE.md
│   ├── ROADMAP.md
│   ├── WEBSITE_SPEC.md            # Ce fichier
│   └── settings.local.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions → GitHub Pages
│
├── package.json
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── .gitignore
```

---

## 4. Règles d'organisation — OBLIGATOIRES

### 4a. Composants (`src/components/`)

| Dossier | Rôle | Contient | NE contient PAS |
|---------|------|----------|-----------------|
| `layout/` | Structure de page | Header, Footer, Nav | Contenu spécifique |
| `sections/` | Blocs de contenu page | Hero, Projects, Skills, About, Contact | Composants réutilisables |
| `ui/` | Atomes réutilisables | Button, Card, Badge, Title | Logique métier, données |
| `animations/` | Scripts client-side | GSAP animations, scroll effects | Composants Astro |

### Hiérarchie de dépendances (Clean Architecture)

```
pages/          → importe sections/ + layout/
sections/       → importe ui/ + data/ + types/
ui/             → importe types/ (PAS sections/, PAS data/)
layout/         → importe ui/ (PAS sections/)
data/           → importe types/ (PAS de composants)
animations/     → standalone (PAS d'imports internes)
```

**INTERDIT** :
- ❌ `ui/` qui importe `sections/` (dépendance inversée)
- ❌ `ui/` qui importe `data/` (le composant ne choisit pas ses données)
- ❌ Texte hardcodé dans `sections/` ou `ui/` (utiliser `data/` ou `i18n/`)
- ❌ Styles inline dans les composants (utiliser Tailwind classes)

### 4b. Données (`src/data/`)

Les fichiers `data/` exportent des **objets typés**, jamais du markup :

```typescript
// ✅ BON — data/projects.ts
export const projects: Project[] = [
  {
    id: 'mindtarot',
    title: 'MindTarot',
    description: 'Introspective tarot app with AI interpretations',
    stack: ['Flutter', 'Firebase', 'Gemini AI'],
    links: { playStore: '...', website: '...' },
    screenshots: ['mindtarot/home.webp', 'mindtarot/draw.webp'],
    featured: true,
  },
];

// ❌ MAUVAIS — données mélangées avec du HTML
export const projectHtml = '<div class="card">MindTarot</div>';
```

### 4c. Types (`src/types/`)

Toutes les interfaces dans un seul fichier `index.ts` (petit projet) :

```typescript
export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  links: ProjectLinks;
  screenshots: string[];
  featured: boolean;
}

export interface Skill {
  name: string;
  icon: string;
  category: SkillCategory;
}

export type SkillCategory = 'mobile' | 'backend' | 'frontend' | 'tools';
```

### 4d. Pages (`src/pages/`)

Une page = un assemblage de sections. AUCUNE logique métier dans les pages :

```astro
// ✅ BON — pages/index.astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Hero from '@components/sections/Hero.astro';
import Projects from '@components/sections/Projects.astro';
import Skills from '@components/sections/Skills.astro';
import About from '@components/sections/About.astro';
import Contact from '@components/sections/Contact.astro';
---
<BaseLayout>
  <Hero />
  <Projects />
  <Skills />
  <About />
  <Contact />
</BaseLayout>
```

### 4e. Naming Conventions

| Type | Convention | Exemple |
|------|-----------|---------|
| Composants Astro | **PascalCase** | `ProjectCard.astro` |
| Fichiers data/types | **camelCase** | `projects.ts`, `index.ts` |
| Fichiers CSS | **kebab-case** | `global.css` |
| Scripts animations | **kebab-case** | `scroll-reveal.ts` |
| Images | **kebab-case** | `mindtarot-home.webp` |
| Dossiers | **kebab-case** | `components/`, `ui/` |
| Props Astro | **camelCase** | `projectData`, `isActive` |
| CSS classes custom | **kebab-case** | `.card-hover`, `.section-title` |

### 4f. Images (`public/images/`)

```
public/images/
├── projects/
│   └── mindtarot/         # Sous-dossier par projet
│       ├── home.webp
│       ├── draw.webp
│       └── chat.webp
├── avatar.webp            # Photo pro (format carré, ≥ 400×400)
├── og-image.png           # Open Graph preview (1200×630)
└── (pas de sous-dossier inutile)
```

- **Format** : WebP pour les screenshots (qualité + taille). PNG pour OG/favicon.
- **Taille max** : 200KB par image (optimiser avant commit)
- **Nommage** : descriptif, kebab-case, pas de `IMG_20260323.jpg`

---

## 5. Sections de la Landing Page

| # | Section | Contenu | Composant |
|---|---------|---------|-----------|
| 1 | **Hero** | Nom + titre + tagline + CTA (projets / contact) | `Hero.astro` |
| 2 | **Projects** | MindTarot featured + autres projets | `Projects.astro` + `ProjectCard.astro` |
| 3 | **Skills** | Stack par catégorie (mobile, backend, frontend, tools) | `Skills.astro` + `SkillBadge.astro` |
| 4 | **About** | Parcours, Thaïlande, ambitions dev + cybersec | `About.astro` |
| 5 | **Contact** | Email + GitHub + Instagram | `Contact.astro` + `SocialLink.astro` |

---

## 6. Design System

### Palette (définie dans `tailwind.config.mjs`)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#0F172A` | Fond principal (Slate 900) |
| `surface` | `#1E293B` | Cartes, sections (Slate 800) |
| `accent` | `#3B82F6` | Liens, CTA, éléments interactifs (Blue 500) |
| `muted` | `#94A3B8` | Texte secondaire (Slate 400) |
| `white` | `#F8FAFC` | Texte principal (Slate 50) |

### Typographie

| Font | Usage | Chargement |
|------|-------|-----------|
| **Inter** | Texte courant, titres | Google Fonts (preload + swap) |
| **JetBrains Mono** | Code, stack technique, badges | Google Fonts (preload + swap) |

### Responsive breakpoints

| Breakpoint | Largeur | Cible |
|-----------|---------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Grand écran |

**Mobile-first** : styles de base = mobile, puis `md:` et `lg:` pour desktop.

---

## 7. Performance

| Métrique | Objectif |
|----------|---------|
| Lighthouse Performance | > 95 |
| Lighthouse Accessibility | > 95 |
| Lighthouse Best Practices | > 95 |
| Lighthouse SEO | > 95 |
| First Contentful Paint | < 1.5s |
| Total JS envoyé | < 50KB (GSAP uniquement) |

---

*Document créé le 2026-03-23*
