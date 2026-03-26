/**
 * Portfolio Scroll Controller
 * Adapted from MindTarot website scroll-controller.ts
 *
 * Grid parallax, Hero fade, illustration convergence → cream card,
 * card exit, phone rise, screenshot transitions, feature labels
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
  gsap.to(gridCanvas, {
    y: -3000,
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
        progressBar.style.left = `${self.progress * 80}%`;
      },
    });
  }

  // --- Hero text fade out + exit left ---
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

  // ============================================
  // Illustrations responsive compression
  // ============================================
  const isMobile = window.innerWidth < 1180;
  const illustrations = [
    document.getElementById('illus-build'),
    document.getElementById('illus-idea'),
    document.getElementById('illus-live'),
    document.getElementById('illus-discussion'),
  ].filter((el): el is HTMLElement => el !== null);

  if (!isMobile && illustrations.length === 4) {
    const DESIGN_WIDTH = 1920;
    const illusOriginals = illustrations.map(el => ({
      el,
      right: parseFloat(el.style.right),
      top: parseFloat(el.style.top),
    }));
    const avgRight = illusOriginals.reduce((s, c) => s + c.right, 0) / illusOriginals.length;
    const avgTop = illusOriginals.reduce((s, c) => s + c.top, 0) / illusOriginals.length;

    function compressIllustrations() {
      const t = Math.max(0, Math.min(1, (window.innerWidth - 1180) / (DESIGN_WIDTH - 1180)));
      const hCompress = 0.5 + 0.5 * t;
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

  // Track convergence triggers so we can disable them during card exit
  const convergenceTriggers: (ScrollTrigger | undefined)[] = [];

  if (myWorkSection && processCard && illusIdea && illusDiscussion && illusBuild && illusLive
      && slotIdea && slotDiscussion && slotBuild && slotLive) {

    const pairs = [
      { illus: illusIdea, slot: slotIdea },
      { illus: illusDiscussion, slot: slotDiscussion },
      { illus: illusBuild, slot: slotBuild },
      { illus: illusLive, slot: slotLive },
    ];

    // --- Illustrations converge ---
    pairs.forEach(({ illus, slot }) => {
      const tween = gsap.to(illus, {
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
      convergenceTriggers.push(tween.scrollTrigger);
    });

    // --- Card fades in ---
    const cardFade = gsap.to(processCard, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: myWorkSection,
        start: 'top 30%',
        end: 'top top',
        scrub: true,
      },
    });
    convergenceTriggers.push(cardFade.scrollTrigger);
  }

  // ============================================
  // Card + illustrations exit up → phone rises
  // ============================================
  const phoneShowcase = document.getElementById('phone-showcase');
  const heroIllustrations = document.getElementById('hero-illustrations');
  const phoneContainer = document.getElementById('phone-container');
  const screenOverlay = document.getElementById('phone-screen-overlay');

  if (phoneShowcase && processCard) {
    // --- Disable convergence triggers when card exits ---
    ScrollTrigger.create({
      trigger: phoneShowcase,
      start: 'top bottom',
      onEnter: () => convergenceTriggers.forEach(t => t?.disable(false)),
      onLeaveBack: () => convergenceTriggers.forEach(t => t?.enable(false)),
    });

    // --- Card + illustrations slide up together (no opacity fade, just exit off-screen) ---
    const exitTargets = [processCard, heroIllustrations].filter(Boolean) as HTMLElement[];
    exitTargets.forEach(el => {
      gsap.to(el, {
        y: '-100vh',
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top bottom',
          end: 'top 30%',
          scrub: true,
        },
      });
    });
  }

  // ============================================
  // Phone rises from bottom
  // ============================================
  if (phoneContainer && phoneShowcase) {
    gsap.fromTo(phoneContainer,
      { xPercent: -50, yPercent: -50, y: '100vh' },
      {
        xPercent: -50,
        yPercent: -50,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneShowcase,
          start: 'top 60%',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );
  }

  // ============================================
  // Black overlay fades out to reveal Home screenshot
  // ============================================
  if (screenOverlay && phoneShowcase) {
    gsap.to(screenOverlay, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: phoneShowcase,
        start: 'top 20%',
        end: 'top top',
        scrub: true,
      },
    });
  }

  // ============================================
  // Screenshot transitions — driven by feature text blocks
  // ============================================
  const featureTextBlocks = document.querySelectorAll<HTMLElement>('.feature-text[data-feature]');
  const phoneSlides = document.querySelectorAll<HTMLElement>('.phone-slide');

  featureTextBlocks.forEach((textBlock, index) => {
    if (index === 0) return; // Home screenshot already visible

    const prevSlide = phoneSlides[index - 1];
    const currSlide = phoneSlides[index];
    if (!prevSlide || !currSlide) return;

    // New screenshot slides up from bottom
    gsap.fromTo(currSlide,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: textBlock,
          start: 'top bottom',
          end: 'top 45%',
          scrub: true,
        },
      }
    );

    // Old screenshot fades out (synced with slide-up)
    gsap.to(prevSlide, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: textBlock,
        start: 'top 85%',
        end: 'top 50%',
        scrub: true,
      },
    });
  });

  // ============================================
  // Feature label — fixed left, changes per feature block
  // ============================================
  const featureLabel = document.getElementById('feature-label');
  const featureLabelText = document.getElementById('feature-label-text');
  const labelTexts = ['Design', 'Interactive', 'AI', 'Chat', 'Data', 'Sound'];

  if (featureLabel && featureLabelText && featureTextBlocks.length > 0) {
    let currentLabel = -1;

    featureTextBlocks.forEach((textBlock, index) => {
      ScrollTrigger.create({
        trigger: textBlock,
        start: 'top 70%',
        onEnter: () => updateLabel(index),
        onLeaveBack: () => { if (index > 0) updateLabel(index - 1); },
      });
    });

    function updateLabel(index: number) {
      if (index === currentLabel) return;
      gsap.killTweensOf(featureLabel);
      currentLabel = index;
      gsap.to(featureLabel, {
        opacity: 0, duration: 0.2, ease: 'power1.in',
        onComplete: () => {
          featureLabelText!.textContent = labelTexts[index] || '';
          gsap.to(featureLabel, { opacity: 1, duration: 0.4, ease: 'power1.out' });
        },
      });
    }

    // Hide label when scrolling back above showcase
    ScrollTrigger.create({
      trigger: featureTextBlocks[0],
      start: 'top bottom',
      onLeaveBack: () => {
        gsap.killTweensOf(featureLabel);
        gsap.set(featureLabel, { opacity: 0 });
        currentLabel = -1;
      },
    });
  }
}
