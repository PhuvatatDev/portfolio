/**
 * Portfolio Scroll Controller
 * Adapted from MindTarot website scroll-controller.ts
 *
 * Phase 1: Grid parallax + color transition (cream → pistachio)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// Color Phases — cream → pistachio
// ============================================
// Same transition pattern as MindTarot:
// 70% stable → 10% darken → 10% crossfade → 10% lighten

interface ColorPhase {
  h: number;  // HSL hue
  s: number;  // HSL saturation (%)
  l: number;  // HSL lightness (%)
}

const COLOR_PHASES: ColorPhase[] = [
  { h: 38, s: 33, l: 95 },   // Cream #F5F3EF
  { h: 80, s: 22, l: 70 },   // Pistachio #B5C99A
];

function interpolateColor(progress: number): string {
  // With 2 phases: simple interpolation with luminosity modulation
  const t = Math.max(0, Math.min(1, progress));

  const from = COLOR_PHASES[0];
  const to = COLOR_PHASES[1];

  // Transition zone: 35% to 65% of scroll
  const transitionStart = 0.35;
  const transitionEnd = 0.65;

  let mixRatio: number;
  let luminosityMod: number;

  if (t <= transitionStart) {
    // Phase 1 stable
    mixRatio = 0;
    luminosityMod = 1.0;
  } else if (t >= transitionEnd) {
    // Phase 2 stable
    mixRatio = 1;
    luminosityMod = 1.0;
  } else {
    // Transition zone
    const transitionProgress = (t - transitionStart) / (transitionEnd - transitionStart);

    // 3-step transition: darken → crossfade → lighten
    if (transitionProgress < 0.33) {
      // Darken current color
      mixRatio = 0;
      luminosityMod = 1.0 - (transitionProgress / 0.33) * 0.15;
    } else if (transitionProgress < 0.66) {
      // Crossfade between colors (darkened)
      mixRatio = (transitionProgress - 0.33) / 0.33;
      luminosityMod = 0.85;
    } else {
      // Lighten new color
      mixRatio = 1;
      luminosityMod = 0.85 + ((transitionProgress - 0.66) / 0.34) * 0.15;
    }
  }

  const h = from.h + (to.h - from.h) * mixRatio;
  const s = from.s + (to.s - from.s) * mixRatio;
  const l = (from.l + (to.l - from.l) * mixRatio) * luminosityMod;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

// ============================================
// Init
// ============================================
export function initScrollController() {
  const gridOverlay = document.getElementById('grid-color-overlay');
  const codeGrid = document.getElementById('code-grid');

  if (!gridOverlay || !codeGrid) return;

  // Get the scrollable canvas (second child of code-grid)
  const gridCanvas = codeGrid.children[1] as HTMLElement;
  if (!gridCanvas) return;

  // --- Grid parallax ---
  // Translate grid canvas based on scroll (slower than content = parallax)
  gsap.to(gridCanvas, {
    y: -3000,  // Grid moves up 3000px over entire scroll
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  // --- Scroll progress bar ---
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // Progress bar slides from left (0%) to right (80%)
        progressBar.style.left = `${self.progress * 80}%`;
      },
    });
  }

  // --- Hero text fade out on scroll ---
  const heroText = document.getElementById('hero-text');

  if (heroText) {
    gsap.to(heroText, {
      opacity: 0,
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '5% top',
        scrub: true,
      },
    });
  }
}
