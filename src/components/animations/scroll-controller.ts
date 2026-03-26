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

  // --- Illustrations responsive compression ---
  // Same pattern as MindTarot cards: compress toward center of gravity on smaller viewports
  const isMobile = window.innerWidth < 1180;
  const illustrations = [
    document.getElementById('illus-build'),
    document.getElementById('illus-idea'),
    document.getElementById('illus-live'),
    document.getElementById('illus-discussion'),
  ].filter((el): el is HTMLElement => el !== null);

  if (!isMobile && illustrations.length === 4) {
    const DESIGN_WIDTH = 1920;

    // Store original positions
    const illusOriginals = illustrations.map(el => ({
      el,
      right: parseFloat(el.style.right),
      top: parseFloat(el.style.top),
    }));

    // Center of gravity
    const avgRight = illusOriginals.reduce((s, c) => s + c.right, 0) / illusOriginals.length;
    const avgTop = illusOriginals.reduce((s, c) => s + c.top, 0) / illusOriginals.length;

    function compressIllustrations() {
      // t: 0 at 1180px, 1 at 1920px
      const t = Math.max(0, Math.min(1, (window.innerWidth - 1180) / (DESIGN_WIDTH - 1180)));

      // Horizontal: 50% spread at 1180px → 100% at 1920px
      const hCompress = 0.5 + 0.5 * t;
      // Vertical: 85% spread at 1180px → 100% at 1920px
      const vCompress = 0.85 + 0.15 * t;

      illusOriginals.forEach(({ el, right, top }) => {
        el.style.right = (avgRight + (right - avgRight) * hCompress) + 'vw';
        el.style.top = (avgTop + (top - avgTop) * vCompress) + 'vh';
      });
    }

    compressIllustrations();
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1180) {
        compressIllustrations();
        ScrollTrigger.refresh();
      }
    });
  }

  // ============================================
  // Illustrations convergence → cream card slots
  // ============================================
  // Same pattern as MindTarot: both illustrations and card are FIXED
  // → same coordinate system → simple scrub tweens with arrow functions
  // No pin needed. Separate ScrollTriggers per animation phase.

  const myWorkSection = document.getElementById('my-work');
  const processCard = document.getElementById('process-card');
  const illusIdea = document.getElementById('illus-idea');
  const illusDiscussion = document.getElementById('illus-discussion');
  const illusBuild = document.getElementById('illus-build');
  const illusLive = document.getElementById('illus-live');

  const slotIdea = document.querySelector('#process-slot-idea .process-illus-slot') as HTMLElement;
  const slotDiscussion = document.querySelector('#process-slot-discussion .process-illus-slot') as HTMLElement;
  const slotBuild = document.querySelector('#process-slot-build .process-illus-slot') as HTMLElement;
  const slotLive = document.querySelector('#process-slot-live .process-illus-slot') as HTMLElement;

  if (myWorkSection && processCard && illusIdea && illusDiscussion && illusBuild && illusLive
      && slotIdea && slotDiscussion && slotBuild && slotLive) {

    const pairs = [
      { illus: illusIdea, slot: slotIdea },
      { illus: illusDiscussion, slot: slotDiscussion },
      { illus: illusBuild, slot: slotBuild },
      { illus: illusLive, slot: slotLive },
    ];

    const badges = document.querySelectorAll('.process-badges');

    // --- Step 1: Illustrations converge FIRST (scroll drives movement) ---
    // Arrow functions → evaluated at creation & on invalidateOnRefresh
    pairs.forEach(({ illus, slot }) => {
      gsap.to(illus, {
        x: () => {
          const ir = illus.getBoundingClientRect();
          const sr = slot.getBoundingClientRect();
          return (sr.left + sr.width / 2) - (ir.left + ir.width / 2);
        },
        y: () => {
          const ir = illus.getBoundingClientRect();
          const sr = slot.getBoundingClientRect();
          return (sr.top + sr.height / 2) - (ir.top + ir.height / 2);
        },
        scale: () => slot.getBoundingClientRect().width / illus.offsetWidth,
        rotateY: 0,
        rotateX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: myWorkSection,
          start: 'top top',
          end: '45% top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    // --- Step 2: Card fades in WHILE illustrations are converging (mid-way) ---
    gsap.to(processCard, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: '15% top',
        end: '35% top',
        scrub: true,
      },
    });

    // --- Step 3: Badges fade in (after illustrations have landed) ---
    badges.forEach((badge) => {
      gsap.to(badge, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: myWorkSection,
          start: '55% top',
          end: '67% top',
          scrub: true,
        },
      });
    });
  }
}
