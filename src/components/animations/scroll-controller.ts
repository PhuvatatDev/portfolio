/**
 * Portfolio Scroll Controller
 * Adapted from MindTarot website scroll-controller.ts
 *
 * Grid parallax, Hero fade, illustration convergence → cream card
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
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
      x: '-100vw',
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: '12% top',
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

    // --- Step 1: Illustrations converge (starts early — as you leave Hero) ---
    // 'top 60%' = animation starts when myWork top is at 60% of viewport (still in Hero)
    // 'top top' = animation ends when myWork top reaches viewport top
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
          start: 'top 85%',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    // --- Step 2: Card fades in (slightly after convergence starts) ---
    gsap.to(processCard, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: 'top 30%',
        end: 'top top',
        scrub: true,
      },
    });

  }
}
